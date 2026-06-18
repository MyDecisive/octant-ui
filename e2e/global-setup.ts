import { execFileSync, spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { CONTEXT, assertKubectlContext, kubectl, kubectlArgs } from "./helpers/kubectl";

const dir = path.dirname(fileURLToPath(import.meta.url));
const tmpDir = path.join(dir, ".tmp");
const OCTANT_URL = "http://localhost:5678";

async function reachable(url: string): Promise<boolean> {
  try {
    await fetch(url, { method: "GET" });
    return true;
  } catch {
    return false;
  }
}

async function waitReachable(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await reachable(url)) return;
    await sleep(500);
  }
  throw new Error(`timed out waiting for ${url}`);
}

// False (not thrown) when the deployment does not exist yet — e.g. right after
// `just octant-bootstrap`, while ArgoCD is still syncing octant in.
function octantDeploymentReady(): boolean {
  try {
    return (
      kubectl([
        "get", "deployment", "octant", "-n", "octant",
        "-o", "jsonpath={.status.conditions[?(@.type=='Available')].status}",
      ]) === "True"
    );
  } catch {
    return false;
  }
}

async function waitForOctantDeployment(timeoutMs: number): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (octantDeploymentReady()) return;
    await sleep(2_000);
  }
  throw new Error(
    "timed out waiting for the octant deployment to become Available — is the cluster bootstrapped (just octant-bootstrap)?",
  );
}

export default async function globalSetup(): Promise<void> {
  // Refuse to run unless the target kubectl context exists; all kubectl calls
  // below pin --context so they cannot touch the wrong cluster.
  assertKubectlContext();
  mkdirSync(tmpDir, { recursive: true });

  // 1. Ensure the octant port-forward is up; record the pid for teardown.
  if (!(await reachable(OCTANT_URL))) {
    // After a fresh `just octant-bootstrap`, ArgoCD is still syncing octant;
    // wait for the deployment to be Available before port-forwarding to it.
    await waitForOctantDeployment(5 * 60_000);
    const pf = spawn(
      "kubectl",
      kubectlArgs(["port-forward", "-n", "octant", "svc/octant", "5678:5678"]),
      { stdio: "ignore", detached: true },
    );
    pf.unref();
    writeFileSync(path.join(tmpDir, "octant-pf.pid"), String(pf.pid));
    await waitReachable(OCTANT_URL, 30_000);
  }

  // 2. Derive an ArgoCD admin token from the in-cluster admin secret.
  const passwordB64 = kubectl([
    "get", "secret", "-n", "argocd", "argocd-initial-admin-secret",
    "-o", "jsonpath={.data.password}",
  ]);
  const password = Buffer.from(passwordB64, "base64").toString("utf8");

  // 2a. Temporary port-forward to the ArgoCD API server (https).
  const argoPf = spawn(
    "kubectl",
    kubectlArgs(["port-forward", "-n", "argocd", "svc/argo-cd-argocd-server", "8443:443"]),
    { stdio: "ignore", detached: true },
  );
  argoPf.unref();
  await sleep(2_000);

  // 2b. Exchange admin credentials for a session JWT (self-signed cert -> -k).
  const sessionJson = execFileSync(
    "curl",
    [
      "-sk", "https://localhost:8443/api/v1/session",
      "-H", "Content-Type: application/json",
      "-d", JSON.stringify({ username: "admin", password }),
    ],
    { encoding: "utf8" },
  );
  const token = (JSON.parse(sessionJson) as { token?: string }).token;
  if (argoPf.pid) {
    try {
      process.kill(-argoPf.pid);
    } catch {
      /* group already gone */
    }
  }
  if (!token) {
    throw new Error(`no token in ArgoCD session response: ${sessionJson}`);
  }

  // 3. Write creds. The ArgoCD address must be cluster-internal because the
  //    octant backend (not the browser) dials it; octant runs in Dev so its
  //    apiclient skips TLS verification of the self-signed cert.
  writeFileSync(
    path.join(tmpDir, "setup.json"),
    JSON.stringify(
      {
        argoUrl: "argo-cd-argocd-server.argocd.svc.cluster.local:443",
        argoToken: token,
        context: CONTEXT,
      },
      null,
      2,
    ),
  );
}
