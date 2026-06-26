#!/usr/bin/env bash
#
# Full local e2e: recreate the cluster from octant-argo-example, then run the
# wizard + dashboard suite against it. With OCTANT_E2E_LOAD=1 it also runs the
# data-dependent assertions, generating load in-process by replaying captured
# telemetry fixtures (no demo stand, no Datadog key).
#
# Requires: just, kind, helm, kubectl, and Node >= 18.19 on PATH.
# The octant-argo-example checkout defaults to octant-ui's sibling; override with
# OCTANT_ARGO_DIR for other layouts.
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ui_dir="$(dirname "$script_dir")" # .../octant-ui
argo_dir="${OCTANT_ARGO_DIR:-$(dirname "$ui_dir")/octant-argo-example}"

if [[ ! -f "$argo_dir/Justfile" ]]; then
  echo "octant-argo-example not found at '$argo_dir'. Set OCTANT_ARGO_DIR to its checkout path." >&2
  exit 1
fi

if ! node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a>18||(a===18&&b>=19)?0:1)' 2>/dev/null; then
  echo "Node >= 18.19 required (found $(node -v 2>/dev/null || echo none)). Try: nvm use 22" >&2
  exit 1
fi

# Capture the load request before clearing it for the smoke run below.
run_load="${OCTANT_E2E_LOAD:-}"

echo "==> Recreating the cluster: just cleanup && just octant-bootstrap ($argo_dir)"
(cd "$argo_dir" && just cleanup && just octant-bootstrap)

echo "==> Running the smoke suite (global-setup waits for octant to be Available)"
(cd "$ui_dir" && OCTANT_E2E_LOAD= npm run e2e:smoke)

if [[ "$run_load" == "1" ]]; then
  # Load runs after the smoke, once the connection (and its collectors) exist.
  # e2e:load replays captured telemetry in-process — no demo stand to bring up.
  echo "==> Running the data-dependent assertions (replayed load)"
  (cd "$ui_dir" && npm run e2e:load)
fi

echo "==> Done."
