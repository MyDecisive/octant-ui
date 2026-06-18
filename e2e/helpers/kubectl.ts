import { execFileSync } from "node:child_process";

// The kubectl context the e2e suite targets. Every kubectl call passes
// --context so destructive/live operations cannot hit the wrong cluster even if
// the shell's current-context points elsewhere. Override with OCTANT_E2E_CONTEXT.
export const CONTEXT = process.env.OCTANT_E2E_CONTEXT ?? "kind-octant-sandbox";

export function kubectl(args: string[]): string {
  return execFileSync("kubectl", ["--context", CONTEXT, ...args], {
    encoding: "utf8",
  }).trim();
}

// Args for spawning a kubectl process (e.g. port-forward) pinned to the context.
export function kubectlArgs(args: string[]): string[] {
  return ["--context", CONTEXT, ...args];
}

// Fail fast in setup if the target context does not exist in the kubeconfig.
export function assertKubectlContext(): void {
  const names = execFileSync("kubectl", ["config", "get-contexts", "-o", "name"], {
    encoding: "utf8",
  })
    .split("\n")
    .map((n) => n.trim());
  if (!names.includes(CONTEXT)) {
    throw new Error(
      `e2e kubectl context "${CONTEXT}" not found in kubeconfig. ` +
        "Set OCTANT_E2E_CONTEXT to the correct context.",
    );
  }
}
