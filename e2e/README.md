# Octant UI end-to-end tests

Playwright tests that drive the live octant backend through the full
install-and-connect wizard and the post-install dashboard, asserting both the UI
and the **cluster effect** of each action (ConfigMaps, secrets, collectors,
ArgoCD app health).

> Run every command from the `octant-ui/` project root (where
> `playwright.config.ts` lives), not from `e2e/`. The `npm run` scripts resolve
> paths themselves.

## 1. Prerequisites (one-time)

On your PATH: `just`, `kind`, `helm`, `kubectl`, and **Node ≥ 18.19** (Playwright's
ESM config needs it). Then:

- **Chromium** for Playwright:
  ```bash
  npx playwright install chromium
  ```
- The **`octant-argo-example`** checkout, which bootstraps the cluster — expected
  as a sibling of the `mdai` repo (override with `OCTANT_ARGO_DIR`).

The cluster itself is **not** a prerequisite: `full-run.sh` creates it from
scratch (step 2). No Datadog account or demo stand is required — the
data-dependent tests replay committed fixtures in-cluster.

## 2. Run the whole suite

### From a fresh cluster — one command

`full-run.sh` recreates the cluster and runs the suite end to end, nothing by
hand:

```bash
e2e/full-run.sh
```

It runs `just cleanup && just octant-bootstrap` in `octant-argo-example`, waits
for octant to come up, then runs every spec in order: findings → guards → wizard
→ dashboard. The data-dependent specs (`4-load`, `5-egress`) stay skipped here.

### Against a cluster that's already up

If you've already bootstrapped the cluster yourself (`just octant-bootstrap` in
`octant-argo-example`) and octant is running:

```bash
npm run e2e:smoke
```

Same four specs, in order. `global-setup` waits for octant, port-forwards it to
`localhost:5678`, and mints an ArgoCD token; `global-teardown` removes both.

View the report afterward with `npx playwright show-report`.

## 3. Include the data-dependent tests (load + egress)

The Clarity surfaces — throughput, cost, log/trace tables, search — are empty
without traffic. `4-load` and `5-egress` generate it **in-cluster** by replaying
committed fixtures into the real ingress (`mdai-envoy`): no demo stand, no
Datadog key. They need a connection to already exist.

From a fresh cluster, in one command:

```bash
OCTANT_E2E_LOAD=1 e2e/full-run.sh      # cleanup → bootstrap → smoke → load
```

Against a cluster that already has a connection (from a prior wizard/smoke run):

```bash
npm run e2e:load       # replays fixtures, waits for log + trace data, asserts Clarity
npm run e2e:egress     # repoints collectors at an in-cluster fakeintake, asserts egress, restores
```

If there's no connection yet, create one first with `npm run e2e:wizard`.

Run the data specs **after** the wizard, not before: the wizard asserts a fresh,
no-telemetry state, and replayed telemetry persists in the cluster between runs.
Re-running the wizard on a cluster that still has recent telemetry fails its
no-data assertions.

## 4. Run individual specs

Every spec is runnable on its own:

```bash
npm run e2e:findings    # known-bug expected-failures (clears the connection)
```
```bash
npm run e2e:guards      # wizard guard rails + step-2 validation (creates no connection)
```
```bash
npm run e2e:wizard      # full install-and-connect wizard (creates/resets the connection)
```
```bash
npm run e2e:dashboard   # post-install dashboard (needs an existing connection)
```
```bash
npm run e2e:load        # data-dependent Clarity assertions (needs a connection)
```
```bash
npm run e2e:egress      # collector egress via fakeintake (needs a connection)
```

Dependencies between them:
- `findings` and `guards` each reset to the no-connection state they need.
- `dashboard`, `load`, and `egress` need a connection — run `e2e:wizard` first,
  or reuse one from a prior run (the hub and connection persist between runs).

Run a single test by title with `-g`:

```bash
npx playwright test e2e/2-dashboard.spec.ts -g "settings update changes the destination"
```

## 5. Configuration

All have working defaults; set them only to target a different cluster, port, or
connection.

| Variable | Default | Effect |
|----------|---------|--------|
| `OCTANT_E2E_CONTEXT` | `kind-octant-sandbox` | kubectl context every call is pinned to; setup fails if it is missing. |
| `OCTANT_E2E_PORT` | `5678` | Local port the suite forwards octant to and the browser drives. |
| `OCTANT_E2E_CONNECTION` | `octant-e2e-smoke` | Connection the wizard creates and the dashboard/data specs target. |
| `OCTANT_E2E_NAMESPACE` | `mdai` | Namespace the connection's collectors and secrets live in. |
| `OCTANT_E2E_LOAD` | _(unset)_ | `1` enables the `4-load` assertions. |
| `OCTANT_E2E_EGRESS` | _(unset)_ | `1` enables the `5-egress` assertions. |
| `OCTANT_ARGO_DIR` | sibling `octant-argo-example` | Cluster-bootstrap repo (`full-run.sh` only). |

Point the dashboard at an existing connection without recreating it:

```bash
OCTANT_E2E_CONNECTION=test-dd-vv-1 npm run e2e:dashboard
```

The wizard spec resets `OCTANT_E2E_CONNECTION`, so do not point it at a
connection you want to keep.

## Specs

Numbered to run in order (single worker); state flows between them.

- **`0-findings`** — known octant bugs as conditional expected-failures
  (`test.fail`): each documents a bug without breaking the suite and turns red
  the moment octant is fixed. Clears the connection.
- **`1-wizard-guards`** — guard rails on the no-connection state: gated-step
  redirects, step-2 field validation, rejected ArgoCD credentials. Creates no
  connection.
- **`1-wizard`** — the install-and-connect wizard (splash → Next Steps),
  verifying each step's cluster effect: hub app healthy, integration secret and
  sampling collectors created, manifest zip holds real collector YAML.
- **`2-dashboard`** — Clarity filters/rates, tabs/search, System Health,
  Settings — each mutation verified in the cluster (variables ConfigMap /
  integration secret), not just in the UI. Needs an existing connection.
- **`4-load`** — data-dependent Clarity assertions (filter metrics, cost
  summary, log/trace tables, search), gated on `OCTANT_E2E_LOAD=1`. Replays
  fixtures and warms up until both log and trace rows land.
- **`5-egress`** — collector egress verification, gated on `OCTANT_E2E_EGRESS=1`.
  Deploys an in-cluster fakeintake, repoints the collectors at it, asserts the
  exported logs and traces, and restores the collectors afterward.

The load is driven by `fixtures/poster.mjs`, which replays the committed
`fixtures/egress-replay.json` into `mdai-envoy`; see its header for how trace
timestamps and ids are refreshed on every send.

## Troubleshooting

- **`localhost:5678 is already in use`** — the suite owns its port-forward so the
  UI and the kubectl assertions target the same cluster. Stop the stale
  `kubectl port-forward` (or set `OCTANT_E2E_PORT` to a free port) and re-run.
- **Cold hub install** can exceed octant's 90s `MDAI_INSTALL_TIMEOUT`; step 3
  dismisses the "Install still in progress" modal and retries (the install is
  idempotent).
- **Dashboard "updates only the API key" flakes on a fresh cluster** — octant
  renders the deploy from a stale informer-cache read (a documented race); it
  passes on a settled cluster, so rerun that test if `full-run.sh` trips on it.
- **Datadog credentials are dummy**, so the install verification reports a
  failure outcome — the data surfaces populate from the replayed fixtures, not a
  live destination.
