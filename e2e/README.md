# Octant UI end-to-end smoke test

Drives the live octant backend through the full install-and-connect wizard and
the post-install dashboard screens. See the design at
`docs/superpowers/specs/2026-06-16-octant-ui-e2e-smoke-design.md`.

## Layout

Specs are numbered to run in order (single worker). State flows between them:
`0-findings` clears the connection, the guards run on that empty state, the
wizard re-creates the connection, and the dashboard/load specs use it.

Negative/validation cases follow two rules so they never break the flow they
share. Cases that need no install live in their own self-contained spec, each
re-navigating from a clean state (step-2 validation is in `1-wizard-guards`).
Cases that need the install ride the single wizard run but stay **non-advancing**
(they never leave their step), and each step's happy-path test re-establishes its
inputs from scratch (idempotent checkboxes, overwriting fills), so a negative case
cannot corrupt the install steps that follow it.

- `0-findings.spec.ts` — known octant bugs encoded as **expected failures**
  (`test.fail`): each asserts the correct behavior, keeps the suite green, and
  turns into a hard error when octant is fixed. Currently: `GetConnections`
  returns 500 on a fresh deploy. Runs first and clears the saved connection.
- `1-wizard-guards.spec.ts` — wizard guard rails on the no-connection state:
  deep-linking a gated step redirects back, step-2 field validation (required,
  min-length, and the empty-submit block) surfaces errors, an invalid URL shows a
  validation error, and invalid ArgoCD credentials are rejected. Creates no
  connection.
- `1-wizard.spec.ts` — the install-and-connect wizard (splash → Next Steps). Its
  `beforeAll` resets the saved connection so the wizard always starts fresh, and
  it retries octant's cold-install timeout modal. Beyond the UI it verifies the
  **cluster effect** of each action: the hub ArgoCD app is Healthy and hub
  workloads exist (step 3); the integration secret and sampling collectors exist
  and the connection's ArgoCD app converges to Healthy (step 4); the agent
  snippet carries the real in-cluster forwarder (step 5); the verification
  reports a failure outcome with no telemetry (step 6); the downloaded manifest
  zip contains real collector YAML (step 7).
- `2-dashboard.spec.ts` — Clarity filters (persist + sampling rate verified in
  the variables ConfigMap and collector rollout; Cancel is a no-op),
  tabs/search, System Health (asserts Smarthub "Operational"), Settings (config
  preview, **Update** verified in the integration secret, download), and the 404
  fallback. Mutating actions also assert the connection's ArgoCD app stays
  Healthy (not Degraded). Runs against an **existing** connection (needs one
  present); does not reset, so it can be iterated on its own.
- `4-load.spec.ts` — data-dependent Clarity assertions (filter metrics, summary
  cost, log/trace tables, search matching), gated on `OCTANT_DEMO_LOAD=1`.
- `load.sh` — secure `octant-demo` load generator (key from Keychain → the
  binary only; never node/argv/repo).
- `global-setup.ts` / `global-teardown.ts` — start the `octant` port-forward
  (localhost:5678) and derive an ArgoCD admin token from
  `argocd-initial-admin-secret`; stop the port-forward afterward.
- `helpers/env.ts` — exposes the derived ArgoCD creds and the connection inputs
  (dummy Datadog values).

## Prerequisites

- The kind cluster (context `kind-octant-sandbox`) with octant deployed and
  ArgoCD installed in the `argocd` namespace. `e2e/full-run.sh` creates this from
  scratch (see "Full local run" below); otherwise bring it up yourself via the
  `octant-argo-example` repo (`just octant-bootstrap`).
- Node.js >= 18.19 (Playwright requires it to load the ESM config). With nvm:
  `nvm use 22`.
- Chromium installed for Playwright: `npx playwright install chromium`.
- For the load-dependent tests only (optional): the `octant-demo` CLI on `PATH`
  and a Datadog API key stored in the macOS Keychain — see "Generating load"
  below for the one-time `security add-generic-password` step.

## Run

Run every command from the `octant-ui/` project root (where `playwright.config.ts`
lives), **not** from `e2e/`. The `npm run` scripts resolve the root on their own; a
bare `npx playwright test …` only finds the config when invoked from the root.

```bash
# Full smoke: wizard (resets itself) then dashboard. The load-dependent tests
# skip unless OCTANT_DEMO_LOAD=1 (see "Generating load" below).
npm run e2e:smoke

# Dashboard only, against an existing connection (fast iteration).
npm run e2e:dashboard
```

No manual `kubectl` is needed — the wizard spec clears the saved connection
itself. View the report after a run: `npx playwright show-report`.

## Full local run (from a fresh cluster)

`e2e/full-run.sh` is a single command that recreates the cluster and runs the
whole flow end to end — no steps are chained by hand:

```bash
e2e/full-run.sh                      # cleanup -> bootstrap -> smoke
OCTANT_DEMO_LOAD=1 e2e/full-run.sh   # the above, then: load up -> data assertions -> load down
```

**Required repo layout.** The cluster comes from a separate `octant-argo-example`
checkout. By default the script expects it as a sibling of the repo that holds
this suite:

```
<code>/
  mdai/octant-ui   # this repo (suite lives in octant-ui/e2e)
  octant-argo-example
```

If yours lives elsewhere, point the script at it: `OCTANT_ARGO_DIR=/path/to/octant-argo-example e2e/full-run.sh`.

It runs `just cleanup && just octant-bootstrap` in that repo, then the suite.
`octant-bootstrap`
only *applies* the octant app-of-apps and returns before ArgoCD finishes syncing
it, so global-setup waits for the `octant` Deployment to become Available before
port-forwarding — no manual readiness step is needed.

The smoke always runs with load **off** (`OCTANT_DEMO_LOAD` is cleared for it), so
step 6 verifies the no-telemetry outcome and the data-dependent specs skip. Only
with `OCTANT_DEMO_LOAD=1` does the script then bring load up — *after* the smoke,
since the demo needs the connection the wizard just created — run the `4-load`
data assertions, and always tear the load stand back down. The Datadog key is read
from the Keychain by `load.sh` and reaches only `octant-demo`, never the suite.
Validating step 6's operational-under-load outcome is out of scope here (it needs
load during the wizard); this runner exercises step 6's Error outcome only.

## Generating load (data-dependent surfaces)

The data-dependent Clarity surfaces (summary table, filter ingested/routed/dropped
metrics, log/trace tables, search results) stay empty without traffic. `load.sh`
drives the `octant-demo` load generator through the Smarthub collector.

The Datadog API key is read from the macOS Keychain and reaches only the
`octant-demo` binary — never the node/Playwright process, never argv, never the
repo. Store it once:

```bash
security add-generic-password -a "$USER" -s octant-demo-api-key -w   # paste at the hidden prompt
```

Then:

```bash
e2e/load.sh up        # deploy the demo stand + start the load generator
# wait ~1 minute for data to flow, then run the full suite WITH the load
# assertions (one command):
OCTANT_DEMO_LOAD=1 npm run e2e:smoke
e2e/load.sh down      # stop load + tear down the demo stand
```

To run only the load assertions while iterating (from the `octant-ui/` root):

```bash
OCTANT_DEMO_LOAD=1 npm run e2e:load
```

The load-gated tests skip unless `OCTANT_DEMO_LOAD=1`, and no API key is present
in their environment.

## Notes

- The wizard run mutates the cluster (saves a connection, installs the hub,
  deploys a collector). The hub and collector are left in place between runs, so
  repeats are warm and fast; only the connection is reset each wizard run.
- Cold installs exceed octant's 90s `MDAI_INSTALL_TIMEOUT`; step 3 dismisses the
  resulting "Install still in progress" modal and retries until the wizard
  advances (the install is idempotent). See the design doc's Findings.
- Datadog credentials are dummy values; verification reports a failure outcome
  (no telemetry). Producing real traffic (a load tool) is what populates the
  Clarity tables, filter metric rows, and search results, and would drive
  verification to "operational" (a documented follow-up, since it needs traffic
  during the wizard run).
- Filter and Settings "update" actions verify the applied value in the cluster
  (the variables ConfigMap / integration secret) rather than the UI's
  "completed" state, which can time out waiting on the collector rollout
  (octant's 60s `FilterSettingUpdateTimeout`). They also wait for any in-flight
  ArgoCD sync on the connection's app to finish first, since octant cannot run
  concurrent operations on it.
