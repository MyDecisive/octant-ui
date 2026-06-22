import { existsSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const pidFile = path.join(dir, ".tmp", "octant-pf.pid");
const setupFile = path.join(dir, ".tmp", "setup.json");

export default function globalTeardown(): void {
  // Always remove the ArgoCD token file — it holds an admin JWT.
  rmSync(setupFile, { force: true });

  if (!existsSync(pidFile)) return;
  const pid = Number(readFileSync(pidFile, "utf8").trim());
  try {
    process.kill(pid);
  } catch {
    /* already exited */
  }
  rmSync(pidFile, { force: true });
}
