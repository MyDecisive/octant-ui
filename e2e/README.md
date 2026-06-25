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

The data-dependent tests need **no** extra setup — they generate load in-cluster
by replaying committed telemetry fixtures (`e2e/fixtures/egress-replay.json`). No
demo stand, no Datadog API key.

## 2. Run one type

Each script targets one spec. They run in numbered order as a suite (section 3),
but every spec is runnable on its own:

```bash
npm run e2e:findings    # known-bug expected-failures (clears the connection)
npm run e2e:guards      # wizard guard rails + step-2 field validation (no connection created)
npm run e2e:wizard      # full install-and-connect wizard (creates/resets the connection)
npm run e2e:dashboard   # post-install dashboard (needs an existing connection)
npm run e2e:load        # data-dependent Clarity assertions (replays fixtures as load)
npm run e2e:egress      # collector egress verification (replay -> fakeintake)
```

Dependencies between them:
- `e2e:guards` and `e2e:findings` are self-contained (each resets to the
  no-connection state it needs).
- `e2e:dashboard`, `e2e:load`, and `e2e:egress` need a connection already present —
  run `e2e:wizard` first, or have one from a prior run.
- `e2e:load` and `e2e:egress` generate their own load (replayed fixtures) — no demo
  or Datadog key needed. `e2e:egress` additionally deploys an in-cluster fakeintake
  and repoints the collectors at it (restored afterward).

Run a single test by title with `-g`, e.g.:
```bash
npx playwright test e2e/2-dashboard.spec.ts -g "settings update changes the destination"
```

## 3. Run the whole suite (no load)

```bash
npm run e2e:smoke
```

Runs every spec in order: findings → guards → wizard (installs the hub, creates
the connection) → dashboard. The `4-load` and `5-egress` tests **skip** unless
`OCTANT_E2E_LOAD=1` / `OCTANT_E2E_EGRESS=1`. No manual `kubectl` is needed — the
wizard resets the saved connection itself. View the report afterward:
`npx playwright show-report`.

## 4. Run the data-dependent tests (with load)

The data-dependent Clarity surfaces (summary table, filter
ingested/routed/dropped metrics, log/trace tables, search results) stay empty
without traffic. The load is generated **in-cluster**: `e2e:load`'s `beforeAll`
deploys a small poster (a Deployment running `fixtures/poster.mjs`) that replays
committed telemetry fixtures to the real ingress (`mdai-envoy`) via service DNS,
rate-capped so it drives throughput without flooding the collectors — no demo
stand, no Datadog key, and no port-forward (so the load never tunnels through the
kube-apiserver). The fixtures are real demo scenarios captured once and committed
(`e2e/fixtures/egress-replay.json`).

Run after the connection exists:

```bash
npm run e2e:smoke      # installs the hub + creates the connection
npm run e2e:load       # replays fixtures as load, waits for warm-up, then asserts
npm run e2e:egress     # repoints collectors at fakeintake, asserts the egress, restores
```

No manual wait or teardown: `e2e:load`'s `beforeAll` starts the replay and polls
until throughput has accumulated (capped at 3 min); `e2e:egress` deploys/removes
fakeintake and patches/restores the collectors itself.

### One command, from a fresh cluster

`full-run.sh` chains everything — no steps run by hand. Run **one** of these
(not both — each recreates the cluster from scratch):

```bash
# without load: cleanup -> bootstrap -> smoke
full-run.sh
```
```bash
# with load: cleanup -> bootstrap -> smoke -> replayed data assertions
OCTANT_E2E_LOAD=1 full-run.sh
```

It runs `just cleanup && just octant-bootstrap` in the `octant-argo-example` repo,
then the suite. The smoke always runs with load **off** (so step 6 verifies the
no-telemetry outcome and the data specs skip); only with `OCTANT_E2E_LOAD=1` does
it then run `4-load` after the smoke (replaying fixtures as load).

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
| `OCTANT_E2E_LOAD` | _(unset)_ | `1` enables the data-dependent `4-load` assertions (replayed load). |
| `OCTANT_E2E_EGRESS` | _(unset)_ | `1` enables the `5-egress` collector-egress assertions (replay → fakeintake). |
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
  since no load flows during the install (step 6); the manifest zip holds real
  collector YAML and the fresh-connection Clarity shows the configured-but-no-data
  empty state whose "Review in System Health" action navigates there (step 7).
- `2-dashboard.spec.ts` — Clarity filters (log/trace persist + sampling rate
  verified in the variables ConfigMap and collector rollout; 0%/100% bounds;
  combined rate+keep-errors apply; Cancel and slider-cancel are no-ops),
  tabs/search, System Health (Smarthub "Operational"; the four Datadog
  connection facets; Revalidate triggers a fresh validator run), Settings (config
  preview; destination-URL update and API-key-only update verified in the
  integration secret; masked-key behavior; telemetry-type change opens the agent
  dialog and flips the connection's stored types; logs-only and traces-only
  variants (reached via a telemetry-type change) show the not-configured tab and
  filter card and the matching Settings defaults; an all-numeric API key is a
  conditional expected-failure documenting a known octant bug — it renders
  unquoted in the integration Secret, so the apply fails and the connection app
  goes OutOfSync, and the test restores a valid key afterward; download), and the
  404 fallback. Mutations also assert the connection's ArgoCD app stays
  Healthy. Needs an existing connection; does not reset.
- `4-load.spec.ts` — data-dependent Clarity assertions (filter metrics, ingest
  cost summary, log/trace tables, percentage/cost consistency, search filtering,
  and a no-match search showing the "No results found" empty state with Clear
  Search restoring rows), gated on `OCTANT_E2E_LOAD=1`. Its `beforeAll` starts the
  replay (`helpers/replay.ts`) and polls until throughput accumulates (capped at
  3 min). Also asserts the System Health connection validation completes to a
  terminal status under load; the Operational-vs-Error outcome is non-deterministic
  with dummy creds (the fidelity validator intermittently fails data integrity).
- `5-egress.spec.ts` — collector **egress** verification, gated on
  `OCTANT_E2E_EGRESS=1`. Deploys an in-cluster fakeintake, repoints the connection's
  collectors at it (collector CRs patched directly — the connection app has ArgoCD
  self-heal off — then restored), replays the fixtures, and asserts the collector
  exports logs and traces to the destination (what real Datadog would receive).
  octant source is untouched.
- `fixtures/egress-replay.json` — real demo scenario telemetry (browse, checkout
  success, http/grpc errors, and wide/deep span trees) captured once and
  committed; replayed as deterministic load. `fixtures/poster.mjs` + `replay.yaml`
  — the in-cluster poster Deployment that replays them at a capped byte rate.
- `helpers/replay.ts` — deploys the in-cluster replay (`replay.yaml` +
  `fixtures/poster.mjs`, fixtures mounted via a ConfigMap) that posts to
  `mdai-envoy` over service DNS and tears it down on stop; `helpers/env.ts`,
  `helpers/kubectl.ts` — derived ArgoCD creds + connection inputs, and the
  context-pinned `kubectl`.
- `global-setup.ts` / `global-teardown.ts` — wait for octant, start its
  port-forward (localhost:5678), derive an ArgoCD admin token from
  `argocd-initial-admin-secret` (written 0600, deleted on teardown).

## Notes

- The wizard run mutates the cluster (saves a connection, installs the hub,
  deploys a collector). The hub and collector are left in place between runs, so
  repeats are warm and fast; only the connection is reset each wizard run.
- Cold installs exceed octant's 90s `MDAI_INSTALL_TIMEOUT`; step 3 dismisses the
  resulting "Install still in progress" modal and retries until the wizard
  advances (the install is idempotent).
- Datadog credentials are dummy values; the install verification reports a failure
  outcome (no load during the install). The data-dependent surfaces populate from
  the replayed fixtures, not a live demo.
- Filter and Settings "update" actions verify the applied value in the cluster
  (the variables ConfigMap / integration secret) rather than the UI's "completed"
  state, which can time out waiting on the collector rollout (octant's 60s
  `FilterSettingUpdateTimeout`). They wait for any in-flight ArgoCD sync on the
  connection's app to finish first.
- The dashboard's `settings updates only the API key` test can flake on a **fresh**
  cluster: octant renders the deploy manifest from a stale informer-cache read (a
  documented race), so the key-only update intermittently doesn't propagate and the
  resourceVersion check times out. It passes on a settled cluster; rerun that test
  if `full-run.sh` trips on it.
