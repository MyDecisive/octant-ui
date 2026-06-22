import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const setup = JSON.parse(
  readFileSync(path.join(dir, "..", ".tmp", "setup.json"), "utf8"),
) as { argoUrl: string; argoToken: string };

export const env = {
  argoUrl: setup.argoUrl,
  argoToken: setup.argoToken,
  // The wizard spec creates this connection; the dashboard/load specs expect it.
  // Override to run against a differently-named connection (e.g. test-dd-vv-1).
  connectionName: process.env.OCTANT_E2E_CONNECTION ?? "octant-e2e-smoke",
  namespace: process.env.OCTANT_E2E_NAMESPACE ?? "mdai",
  datadogUrl: "https://app.datadoghq.com",
  datadogApiKey: "0123456789abcdef0123456789abcdef",
};
