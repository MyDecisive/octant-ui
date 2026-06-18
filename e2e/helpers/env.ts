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
  connectionName: "octant-e2e-smoke",
  namespace: "mdai",
  datadogUrl: "https://app.datadoghq.com",
  datadogApiKey: "0123456789abcdef0123456789abcdef",
};
