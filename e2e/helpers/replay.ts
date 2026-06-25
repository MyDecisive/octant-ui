import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./env";
import { kubectl } from "./kubectl";

// Replays captured scenario telemetry into the real ingress so it traverses the
// real sampling pipeline — driving Clarity (collector throughput) and egress,
// with no demo or Datadog key. The replay runs IN-CLUSTER (a Deployment posting
// to mdai-envoy via service DNS, see e2e/replay.yaml + fixtures/poster.mjs), not
// through a kubectl port-forward: a port-forward tunnels every byte through the
// kube-apiserver proxy, caps throughput at the proxy's bandwidth, and floods the
// collector. In-cluster ingest is how a real Datadog agent reaches mdai-envoy
// and lets the poster pace its own byte rate. The fixtures are real demo
// scenarios (success + error + browse) captured once and committed; see
// e2e/fixtures.
const dir = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(dir, "..", "fixtures", "egress-replay.json");
const POSTER = path.join(dir, "..", "fixtures", "poster.mjs");
const MANIFEST = path.join(dir, "..", "replay.yaml");
const CONFIGMAP = "octant-e2e-replay";
const DEPLOYMENT = "octant-e2e-replay";

export interface ReplayHandle {
  stop: () => void;
}

// Deploys the in-cluster replay poster and waits for it to be running. The
// fixtures and poster script ride in a ConfigMap (re-created each run so edits
// take effect); the rollout wait covers the node image pull on a cold cluster.
export function startReplay(): ReplayHandle {
  // Delete any leftover Deployment from an interrupted run first: `apply` over an
  // existing one is a no-op, so the poster would keep the fixtures it read into
  // memory at startup — stale even though the ConfigMap below is re-created fresh.
  kubectl(["delete", "-n", env.namespace, "-f", MANIFEST, "--ignore-not-found"]);
  kubectl(["delete", "configmap", CONFIGMAP, "-n", env.namespace, "--ignore-not-found"]);
  kubectl([
    "create", "configmap", CONFIGMAP, "-n", env.namespace,
    `--from-file=egress-replay.json=${FIXTURES}`,
    `--from-file=poster.mjs=${POSTER}`,
  ]);
  kubectl(["apply", "-n", env.namespace, "-f", MANIFEST]);
  kubectl(["-n", env.namespace, "rollout", "status", `deploy/${DEPLOYMENT}`, "--timeout=180s"]);

  return {
    stop: () => {
      kubectl(["delete", "-n", env.namespace, "-f", MANIFEST, "--ignore-not-found"]);
      kubectl(["delete", "configmap", CONFIGMAP, "-n", env.namespace, "--ignore-not-found"]);
    },
  };
}
