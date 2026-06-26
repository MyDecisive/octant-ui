import { execFileSync, spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { CONTEXT, assertKubectlContext, kubectl, kubectlArgs } from "./helpers/kubectl";

const dir = path.dirname(fileURLToPath(import.meta.url));
const tmpDir = path.join(dir, ".tmp");
const PORT = Number(process.env.OCTANT_E2E_PORT ?? 5678);
const OCTANT_URL = `http://localhost:${PORT}`;

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

// Whether the local port is bindable — i.e. nothing already serves on it.
function portFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const probe = createServer();
    probe.once("error", () => resolve(false));
    probe.once("listening", () => probe.close(() => resolve(true)));
    probe.listen(port, "127.0.0.1");
  });
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

// curl exits 0 once the TLS handshake to the ArgoCD port-forward succeeds (even
// a 403/404), and non-zero while the forward is still coming up.
function argoReachable(): boolean {
  try {
    execFileSync("curl", ["-sk", "-o", "/dev/null", "https://localhost:8443/"], {
      encoding: "utf8",
    });
    return true;
  } catch {
    return false;
  }
}

async function waitArgoReachable(timeoutMs: number): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (argoReachable()) return;
    await sleep(300);
  }
  throw new Error("timed out waiting for the ArgoCD port-forward on localhost:8443");
}

export default async function globalSetup(): Promise<void> {
  // Refuse to run unless the target kubectl context exists; all kubectl calls
  // below pin --context so they cannot touch the wrong cluster.
  assertKubectlContext();
  mkdirSync(tmpDir, { recursive: true });

  // 1. Own the octant port-forward so the UI and the context-pinned assertions hit
  //    the same cluster; refuse to adopt one we didn't start (it could forward a
  //    different cluster's octant), so fail if the port is already taken.
  if (!(await portFree(PORT))) {
    throw new Error(
      `localhost:${PORT} is already in use; the e2e suite must own the port-forward to ` +
        `context "${CONTEXT}". Stop whatever holds the port (e.g. a stale ` +
        `"kubectl port-forward") or set OCTANT_E2E_PORT to a free port, then re-run.`,
    );
  }
  // After a fresh `just octant-bootstrap`, ArgoCD is still syncing octant; wait for
  // the deployment to be Available before port-forwarding to it.
  await waitForOctantDeployment(5 * 60_000);
  const pf = spawn(
    "kubectl",
    kubectlArgs(["port-forward", "-n", "octant", "svc/octant", `${PORT}:5678`]),
    { stdio: "ignore", detached: true },
  );
  pf.unref();
  writeFileSync(path.join(tmpDir, "octant-pf.pid"), String(pf.pid));
  await waitReachable(OCTANT_URL, 30_000);

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

  // 2b. Exchange admin credentials for a session JWT (self-signed cert -> -k).
  // try/finally so a curl/parse failure still tears the port-forward down.
  let token: string | undefined;
  try {
    await waitArgoReachable(30_000);
    const sessionJson = execFileSync(
      "curl",
      [
        "-sk", "https://localhost:8443/api/v1/session",
        "-H", "Content-Type: application/json",
        "-d", JSON.stringify({ username: "admin", password }),
      ],
      { encoding: "utf8" },
    );
    token = (JSON.parse(sessionJson) as { token?: string }).token;
  } finally {
    if (argoPf.pid) {
      try {
        process.kill(-argoPf.pid);
      } catch {
        /* group already gone */
      }
    }
  }
  if (!token) {
    throw new Error("no token in ArgoCD session response");
  }

  // 3. Write creds. The ArgoCD address must be cluster-internal because the
  //    octant backend (not the browser) dials it; octant runs in Dev so its
  //    apiclient skips TLS verification of the self-signed cert. The file holds
  //    an admin JWT, so drop any prior (possibly world-readable) copy and write
  //    0600; global-teardown deletes it.
  const setupPath = path.join(tmpDir, "setup.json");
  rmSync(setupPath, { force: true });
  writeFileSync(
    setupPath,
    JSON.stringify(
      {
        argoUrl: "argo-cd-argocd-server.argocd.svc.cluster.local:443",
        argoToken: token,
        context: CONTEXT,
      },
      null,
      2,
    ),
    { mode: 0o600 },
  );
}
