#!/usr/bin/env bash
#
# Generate real traffic through the Smarthub collector so the data-dependent
# Clarity surfaces (summary table, filter metric rows, data tables, search)
# populate.
#
# Security: the Datadog API key is read from the macOS Keychain and passed ONLY
# to the octant-demo binary's environment, per-command — it is never exported,
# never placed in argv, and never enters the node/Playwright process. Tracing
# (set -x) is deliberately NOT enabled, since it would echo the key.
#
# Usage:
#   e2e/load.sh up      # deploy the demo stand + start the load generator
#   e2e/load.sh down    # stop the load generator + tear down the demo stand
#
# Override defaults via env: OCTANT_DEMO_BIN, OCTANT_DEMO_FORWARDER_URL,
# OCTANT_DEMO_RPS, OCTANT_DEMO_KEYCHAIN_SERVICE.
set -euo pipefail

DEMO="${OCTANT_DEMO_BIN:-octant-demo}"
FORWARDER="${OCTANT_DEMO_FORWARDER_URL:-http://mdai-envoy.mdai.svc.cluster.local:8126}"
RPS="${OCTANT_DEMO_RPS:-50}"
KEYCHAIN_SERVICE="${OCTANT_DEMO_KEYCHAIN_SERVICE:-octant-demo-api-key}"

case "${1:-}" in
  up)
    key="$(security find-generic-password -a "$USER" -s "$KEYCHAIN_SERVICE" -w)"
    OCTANT_DEMO_API_KEY="$key" "$DEMO" up --forwarder-url="$FORWARDER"
    OCTANT_DEMO_API_KEY="$key" "$DEMO" load enable --rps="$RPS"
    unset key
    echo "Load running (rps=$RPS -> $FORWARDER)."
    echo "Give it ~1 minute, then: OCTANT_DEMO_LOAD=1 npm run e2e:dashboard"
    ;;
  down)
    # Teardown does not need the API key.
    "$DEMO" load disable || true
    "$DEMO" down
    ;;
  *)
    echo "usage: $0 [up|down]" >&2
    exit 2
    ;;
esac
