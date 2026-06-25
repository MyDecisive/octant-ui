import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";
import { env } from "./helpers/env";
import { kubectl, kubectlArgs } from "./helpers/kubectl";
import { startReplay, type ReplayHandle } from "./helpers/replay";

// Egress verification. Replays captured scenario telemetry into the real ingress
// (via the shared replay helper), repoints the connection's collectors at an
// in-cluster fakeintake, and asserts what the collector actually exports — the
// payloads real Datadog would receive. Nothing else covers this: Clarity = pipeline
// metrics, the validator = sampling fidelity. No demo or Datadog key. octant source
// is untouched: the collector CRs are patched directly (the connection app has
// ArgoCD self-heal off, so the patch sticks) and restored afterward.
const dir = path.dirname(fileURLToPath(import.meta.url));
const FAKEINTAKE_MANIFEST = path.join(dir, "fakeintake.yaml");
const FAKEINTAKE_URL = "http://localhost:18099";
const FAKEINTAKE_ENDPOINT = `http://fakeintake.${env.namespace}.svc.cluster.local`;
const SAMPLING_COLLECTORS = [
  `${env.connectionName}-trace-sampling`,
  `${env.connectionName}-log-sampling`,
];

const toFakeintakePatch = JSON.stringify({
  spec: {
    config: {
      exporters: {
        datadog: {
          api: { fail_on_invalid_key: false },
          traces: { endpoint: FAKEINTAKE_ENDPOINT },
          logs: { endpoint: FAKEINTAKE_ENDPOINT },
          metrics: { endpoint: FAKEINTAKE_ENDPOINT },
        },
      },
    },
  },
});
const restorePatch = JSON.stringify({
  spec: {
    config: {
      exporters: {
        datadog: { api: { fail_on_invalid_key: null }, traces: null, logs: null, metrics: null },
      },
    },
  },
});

async function fakeintakeRoutes(): Promise<Record<string, { count: number }>> {
  const res = await fetch(`${FAKEINTAKE_URL}/fakeintake/routestats`);
  return ((await res.json()) as { routes?: Record<string, { count: number }> }).routes ?? {};
}

test.describe.serial("collector egress to Datadog (via fakeintake)", () => {
  // Opt-in: deploys fakeintake and repoints the connection's collectors. Run via
  // `npm run e2e:egress`. Needs an existing connection (its sampling collectors).
  test.skip(process.env.OCTANT_E2E_EGRESS !== "1", "run via npm run e2e:egress");

  let replay: ReplayHandle | undefined;
  let fakeintakePf: ChildProcess | undefined;

  test.beforeAll(async () => {
    kubectl(["apply", "-n", env.namespace, "-f", FAKEINTAKE_MANIFEST]);
    kubectl(["-n", env.namespace, "rollout", "status", "deploy/fakeintake", "--timeout=120s"]);

    for (const collector of SAMPLING_COLLECTORS) {
      kubectl(["patch", "opentelemetrycollector", collector, "-n", env.namespace,
        "--type", "merge", "-p", toFakeintakePatch]);
    }
    for (const collector of SAMPLING_COLLECTORS) {
      kubectl(["-n", env.namespace, "rollout", "status",
        `deploy/${collector}-collector`, "--timeout=120s"]);
    }

    fakeintakePf = spawn("kubectl",
      kubectlArgs(["-n", env.namespace, "port-forward", "svc/fakeintake", "18099:80"]),
      { stdio: "ignore", detached: true });
    fakeintakePf.unref();
    // Poll the forwarded endpoint until it answers instead of a fixed sleep — a slow
    // port-forward would otherwise make the first un-retried fetch in the test fail.
    await expect
      .poll(
        () =>
          fetch(`${FAKEINTAKE_URL}/fakeintake/routestats`)
            .then((r) => r.ok)
            .catch(() => false),
        { timeout: 30_000, intervals: [500] },
      )
      .toBe(true);

    replay = startReplay();
  });

  test.afterAll(() => {
    replay?.stop();
    for (const collector of SAMPLING_COLLECTORS) {
      try {
        kubectl(["patch", "opentelemetrycollector", collector, "-n", env.namespace,
          "--type", "merge", "-p", restorePatch]);
      } catch {
        /* best-effort restore */
      }
    }
    if (fakeintakePf?.pid) {
      try {
        process.kill(-fakeintakePf.pid);
      } catch {
        /* already gone */
      }
    }
    kubectl(["delete", "-n", env.namespace, "-f", FAKEINTAKE_MANIFEST, "--ignore-not-found"]);
  });

  test("replayed telemetry is exported to the destination as logs and traces", async () => {
    test.setTimeout(4 * 60 * 1000);
    await fetch(`${FAKEINTAKE_URL}/fakeintake/flushPayloads`, { method: "POST" });

    // The replayed records traverse the real sampling pipeline and are exported
    // to the destination — both signals reach fakeintake.
    await expect
      .poll(
        async () => {
          const routes = await fakeintakeRoutes();
          return (
            (routes["/api/v2/logs"]?.count ?? 0) > 0 &&
            (routes["/api/v0.2/traces"]?.count ?? 0) > 0
          );
        },
        { timeout: 2 * 60_000, intervals: [5_000] },
      )
      .toBe(true);
  });
});
