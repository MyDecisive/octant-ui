# Octant UI end-to-end smoke test

Drives the live octant backend through the full install-and-connect wizard and
the post-install dashboard screens, asserting both the UI and the **cluster
effect** of each action (ConfigMaps, secrets, collectors, ArgoCD app health). See
the design at `docs/superpowers/specs/2026-06-16-octant-ui-e2e-smoke-design.md`.

> Run every command from the `octant-ui/` project root (where
> `playwright.config.ts` lives), **not** from `e2e/`. The `npm run` scripts resolve
> the root themselves; a bare `npx playwright test …` only finds the config from
> the root.

## 1. Preinstall (one-time)

- **Cluster.** A kind cluster (context `kind-octant-sandbox`) with octant deployed
  and ArgoCD in the `argocd` namespace. Either let `e2e/full-run.sh` create it from
  scratch (section 4), or bring it up yourself from the `octant-argo-example` repo:
  ```bash
  just octant-bootstrap        # in the octant-argo-example checkout
  ```
- **Node ≥ 18.19** (Playwright needs it to load the ESM config):
  ```bash
  nvm use 22
  ```
- **Chromium** for Playwright:
  ```bash
  npx playwright install chromium
  ```
- **Load only (optional).** For the data-dependent `4-load` tests: the
  `octant-demo` CLI on `PATH`, and the Datadog API key stored once in the macOS
  Keychain (read only by `octant-demo`, never by the test process):
  ```bash
  security add-generic-password -a "$USER" -s octant-demo-api-key -w   # paste at the hidden prompt
  ```

## 2. Run one type

Each script targets one spec. They run in numbered order as a suite (section 3),
but every spec is runnable on its own:

```bash
npm run e2e:findings    # known-bug expected-failures (clears the connection)
npm run e2e:guards      # wizard guard rails + step-2 field validation (no connection created)
npm run e2e:wizard      # full install-and-connect wizard (creates/resets the connection)
npm run e2e:dashboard   # post-install dashboard (needs an existing connection)
npm run e2e:load        # data-dependent Clarity assertions (needs a connection + live load)
```

Dependencies between them:
- `e2e:guards` and `e2e:findings` are self-contained (each resets to the
  no-connection state it needs).
- `e2e:dashboard` and `e2e:load` need a connection already present — run
  `e2e:wizard` first, or have one from a prior run.
- `e2e:load` additionally needs live traffic — see section 4.

Run a single test by title with `-g`, e.g.:
```bash
npx playwright test e2e/2-dashboard.spec.ts -g "settings update changes the destination"
```

## 3. Run the whole suite (no load)

```bash
npm run e2e:smoke
```

Runs every spec in order: findings → guards → wizard (installs the hub, creates
the connection) → dashboard. The `4-load` tests **skip** unless
`OCTANT_DEMO_LOAD=1`. No manual `kubectl` is needed — the wizard resets the saved
connection itself. View the report afterward: `npx playwright show-report`.

## 4. Run the whole suite with load

The data-dependent Clarity surfaces (summary table, filter
ingested/routed/dropped metrics, log/trace tables, search results) stay empty
without traffic. `load.sh` drives the `octant-demo` load generator through the
Smarthub collector; the Keychain key reaches only that binary, never the suite.

Load must run **after** the connection exists, so bring the suite up first, then
the load, then the load assertions:

```bash
npm run e2e:smoke                       # installs the hub + creates the connection
load.sh up                          # deploy the demo stand + start the generator
OCTANT_DEMO_LOAD=1 npm run e2e:load     # auto-waits for warm-up, then asserts
load.sh down                        # stop load + tear down the demo stand
```

No manual wait is needed: the load suite's `beforeAll` polls until throughput has
accumulated (capped at 3 minutes), so a cold stand warms up automatically and an
already-warm one proceeds at once.

### One command, from a fresh cluster

`full-run.sh` chains everything — no steps run by hand. Run **one** of these
(not both — each recreates the cluster from scratch):

```bash
# without load: cleanup -> bootstrap -> smoke
full-run.sh
```
```bash
# with load: cleanup -> bootstrap -> smoke -> load up -> data assertions -> load down
OCTANT_DEMO_LOAD=1 full-run.sh
```

It runs `just cleanup && just octant-bootstrap` in the `octant-argo-example` repo,
then the suite. The smoke always runs with load **off** (so step 6 verifies the
no-telemetry outcome and the data specs skip); only with `OCTANT_DEMO_LOAD=1` does
it then bring load up after the smoke, run `4-load`, and always tear the stand back
down.

`octant-bootstrap` only *applies* the octant app-of-apps and returns before ArgoCD
finishes syncing it, so global-setup waits for the `octant` Deployment to become
Available before port-forwarding — no manual readiness step is needed.

**Required repo layout.** By default the script expects `octant-argo-example` as a
sibling of the repo holding this suite:

```
<code>/
  mdai/octant-ui        # this repo (suite lives in octant-ui/e2e)
  octant-argo-example
```

If yours lives elsewhere: `OCTANT_ARGO_DIR=/path/to/octant-argo-example e2e/full-run.sh`.

## Environment overrides

All have working defaults; set them only to target a different cluster or
connection.

| Variable | Default | Effect |
|----------|---------|--------|
| `OCTANT_E2E_CONTEXT` | `kind-octant-sandbox` | kubectl context every call is pinned to; setup refuses to run if it is missing. |
| `OCTANT_E2E_CONNECTION` | `octant-e2e-smoke` | Connection name the wizard creates and the dashboard/load specs target. |
| `OCTANT_E2E_NAMESPACE` | `mdai` | Namespace the connection's collectors and secrets live in. |
| `OCTANT_DEMO_LOAD` | _(unset)_ | `1` enables the data-dependent `4-load` assertions. |
| `OCTANT_ARGO_DIR` | sibling `octant-argo-example` | Location of the cluster-bootstrap repo (`full-run.sh` only). |

Point the **dashboard** spec at an existing connection without recreating it:

```bash
OCTANT_E2E_CONNECTION=test-dd-vv-1 npm run e2e:dashboard
```

The **wizard** spec creates/resets `OCTANT_E2E_CONNECTION`, so do not point it at a
connection you want to keep.

## Specs

Numbered to run in order (single worker); state flows between them.

- `0-findings.spec.ts` — known octant bugs as **conditional expected failures**
  (`test.fail(condition, …)`): each asserts the correct behavior and is marked
  expected-failure only when the specific bug symptom occurs, so unrelated
  regressions still fail loudly. Currently: `GetConnections` returns 500 when the
  connections ConfigMap is absent. Clears the saved connection.
- `1-wizard-guards.spec.ts` — guard rails on the no-connection state (own
  `beforeAll` reset): deep-linking a gated step redirects back; step-2 field
  validation (required, min-length, empty-submit block); invalid URL; rejected
  ArgoCD credentials. Creates no connection.
- `1-wizard.spec.ts` — the install-and-connect wizard (splash → Next Steps),
  resetting the connection in `beforeAll`. Verifies the cluster effect of each
  step: hub ArgoCD app Healthy and workloads present (step 3); collector deploy is
  gated until type+URL+key are set, an invalid key fails (conditional
  expected-failure), and the integration secret + sampling collectors are created
  with the connection app Healthy (step 4); the agent snippet carries the real
  in-cluster forwarder (step 5); verification reports the no-telemetry outcome,
  or "operational" under `OCTANT_DEMO_LOAD=1` (step 6); the manifest zip holds real
  collector YAML (step 7).
- `2-dashboard.spec.ts` — Clarity filters (log/trace persist + sampling rate
  verified in the variables ConfigMap and collector rollout; 0%/100% bounds;
  combined rate+keep-errors apply; Cancel and slider-cancel are no-ops),
  tabs/search, System Health ("Operational"), Settings (config preview;
  destination-URL update and API-key-only update verified in the integration
  secret; masked-key behavior; telemetry-type change opens the agent dialog and
  flips the connection's stored types; download), and the 404 fallback. Mutations
  also assert the connection's ArgoCD app stays Healthy. Needs an existing
  connection; does not reset.
- `4-load.spec.ts` — data-dependent Clarity assertions (filter metrics, ingest
  cost summary, log/trace tables, percentage/cost consistency, search filtering),
  gated on `OCTANT_DEMO_LOAD=1`.
- `load.sh` — `octant-demo` load generator (`up`/`down`); key from Keychain → the
  binary only, never node/argv/repo.
- `global-setup.ts` / `global-teardown.ts` — wait for octant, start its
  port-forward (localhost:5678), derive an ArgoCD admin token from
  `argocd-initial-admin-secret` (written 0600, deleted on teardown).
- `helpers/env.ts`, `helpers/kubectl.ts` — derived ArgoCD creds + connection
  inputs, and the context-pinned `kubectl` wrapper.

## Notes

- The wizard run mutates the cluster (saves a connection, installs the hub,
  deploys a collector). The hub and collector are left in place between runs, so
  repeats are warm and fast; only the connection is reset each wizard run.
- Cold installs exceed octant's 90s `MDAI_INSTALL_TIMEOUT`; step 3 dismisses the
  resulting "Install still in progress" modal and retries until the wizard
  advances (the install is idempotent).
- Datadog credentials are dummy values; without load, verification reports a
  failure outcome. Live traffic populates the Clarity tables, filter metric rows,
  and search results, and drives verification toward "operational".
- Filter and Settings "update" actions verify the applied value in the cluster
  (the variables ConfigMap / integration secret) rather than the UI's "completed"
  state, which can time out waiting on the collector rollout (octant's 60s
  `FilterSettingUpdateTimeout`). They wait for any in-flight ArgoCD sync on the
  connection's app to finish first.
