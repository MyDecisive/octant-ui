#!/usr/bin/env bash
#
# Full local e2e: recreate the cluster from octant-argo-example, then run the
# wizard + dashboard suite against it. With OCTANT_DEMO_LOAD=1 it also generates
# load and runs the data-dependent assertions.
#
# Requires: just, kind, helm, kubectl, and Node >= 18.19 on PATH.
# The octant-argo-example checkout defaults to a sibling of the mdai repo;
# override with OCTANT_ARGO_DIR.
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ui_dir="$(dirname "$script_dir")" # .../octant-ui
argo_dir="${OCTANT_ARGO_DIR:-$(dirname "$(dirname "$ui_dir")")/octant-argo-example}"

if [[ ! -f "$argo_dir/Justfile" ]]; then
  echo "octant-argo-example not found at '$argo_dir'. Set OCTANT_ARGO_DIR to its checkout path." >&2
  exit 1
fi

if ! node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a>18||(a===18&&b>=19)?0:1)' 2>/dev/null; then
  echo "Node >= 18.19 required (found $(node -v 2>/dev/null || echo none)). Try: nvm use 22" >&2
  exit 1
fi

# Capture the load request before clearing it for the smoke run below.
run_load="${OCTANT_DEMO_LOAD:-}"

echo "==> Recreating the cluster: just cleanup && just octant-bootstrap ($argo_dir)"
(cd "$argo_dir" && just cleanup && just octant-bootstrap)

# Smoke runs without load: step 6 verifies the no-telemetry outcome and the
# data-dependent specs skip. Load runs afterwards, once the connection exists.
echo "==> Running the smoke suite (global-setup waits for octant to be Available)"
(cd "$ui_dir" && OCTANT_DEMO_LOAD= npm run e2e:smoke)

if [[ "$run_load" == "1" ]]; then
  echo "==> Generating load and running the data-dependent assertions"
  (cd "$ui_dir" && e2e/load.sh up)
  load_status=0
  (cd "$ui_dir" && OCTANT_DEMO_LOAD=1 npm run e2e:load) || load_status=$?
  (cd "$ui_dir" && e2e/load.sh down) # always tear the stand back down
  [[ $load_status -eq 0 ]] || exit "$load_status"
fi

echo "==> Done."
