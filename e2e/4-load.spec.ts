import { test, expect, type Locator, type Page } from "@playwright/test";
import { startReplay, type ReplayHandle } from "./helpers/replay";

// Data-dependent Clarity assertions. The load is generated in-process by
// replaying captured scenario telemetry into the real ingress (no demo, no
// Datadog key) — see helpers/replay.ts. Gate: OCTANT_E2E_LOAD=1.
test.describe("clarity under load", () => {
  test.skip(
    process.env.OCTANT_E2E_LOAD !== "1",
    "run via: OCTANT_E2E_LOAD=1 npm run e2e:load (replays captured fixtures as load)",
  );

  let replay: ReplayHandle | undefined;

  // Reads a filter-card metric row (e.g. "Ingested 0.46 GB") as a number.
  async function metric(card: Locator, label: string): Promise<number> {
    const match = (await card.innerText()).match(new RegExp(`${label}\\s+([\\d.]+)`));
    return match ? Number(match[1]) : 0;
  }

  // Clarity queries its budget once per page mount (no auto-refresh), so re-navigate
  // before each read. `waitFor` selects which response to wake on: the summary and
  // metrics come from `overall`, but the log/trace TABLE rows come from the `log`/
  // `trace` calls the hook fires only after `overall` resolves — waking on `overall`
  // reads the table before its rows were requested.
  async function refetch<T>(
    page: Page,
    read: () => Promise<T>,
    waitFor: RegExp = /BudgetService/i,
  ): Promise<T> {
    const budget = page
      .waitForResponse((r) => waitFor.test(r.url()), { timeout: 20_000 })
      .catch(() => undefined);
    await page.goto("/clarity");
    await budget;
    return read();
  }

  // The replay emits these (the synthetic validator telemetry does not), so the table
  // tests assert by name. The log table is per-service; the trace table is root-based,
  // so traces use the replay's gateway root, not a child like inventory-grpc-service.
  const LOG_SERVICE = "inventory-grpc-service";
  const TRACE_ROOT = "gateway-api";

  // Warm up until the replayed rows land in BOTH tables: logs and traces propagate to
  // GreptimeDB independently, so gating on log throughput alone would let the trace
  // assertions run against a still-empty trace table. The per-poll log shows progress.
  test.beforeAll(async ({ browser }) => {
    if (process.env.OCTANT_E2E_LOAD !== "1") return;
    replay = startReplay();
    const page = await browser.newPage();
    const rows = page
      .locator('.mdai-table:not(.summary-table) [role="row"]')
      .filter({ has: page.locator('[role="gridcell"]') });
    const rowsInclude = async (needle: string) =>
      (await rows.allInnerTexts()).some((t) => t.includes(needle));
    const warmupStart = Date.now();
    const elapsed = () => Math.round((Date.now() - warmupStart) / 1000);
    try {
      await expect
        .poll(
          async () => {
            const log = await refetch(
              page,
              () => rowsInclude(LOG_SERVICE),
              /BudgetService\/Log/i,
            );
            const trace = await refetch(
              page,
              async () => {
                await page.getByRole("tab", { name: /Traces/ }).click();
                return rowsInclude(TRACE_ROOT);
              },
              /BudgetService\/Trace/i,
            );
            console.log(`[4-load] warm-up log=${log} trace=${trace} (+${elapsed()}s)`);
            return log && trace;
          },
          { timeout: 3 * 60_000, intervals: [5_000] },
        )
        .toBe(true);
    } finally {
      await page.close();
    }
  });

  test.afterAll(() => {
    replay?.stop();
  });

  test("log filter metrics populate from collector throughput", async ({ page }) => {
    const logCard = page.locator(".filter-card-container", { hasText: "Log filters" });

    // Ingested and Routed are 0 when idle and both climb above 0 under load. Poll
    // both together (Routed can lag Ingested) rather than reading Routed once.
    await expect
      .poll(
        () =>
          refetch(page, async () =>
            Math.min(await metric(logCard, "Ingested"), await metric(logCard, "Routed")),
          ),
        { timeout: 30_000 },
      )
      .toBeGreaterThan(0);
  });

  test("summary shows a non-zero ingest cost total", async ({ page }) => {
    // The summary toolbar renders the total as "$<value>" ("$-" when idle).
    const total = page.locator(".mdai-summary-table-toolbar").getByText(/^\$/);
    await expect
      .poll(
        () =>
          refetch(page, async () => {
            const text = await total.innerText().catch(() => "$-");
            return Number(text.replace(/[^0-9.]/g, "")) || 0;
          }),
        { timeout: 30_000 },
      )
      .toBeGreaterThan(0);
  });

  test("log and trace tables populate with sources", async ({ page }) => {
    // Data rows by ARIA role (role=row containing gridcells), scoped to the
    // non-summary table — stable across MUI versions, unlike the .MuiDataGrid-row class.
    const rows = page
      .locator('.mdai-table:not(.summary-table) [role="row"]')
      .filter({ has: page.locator('[role="gridcell"]') });
    const rowsInclude = async (needle: string) =>
      (await rows.allInnerTexts()).some((t) => t.includes(needle));

    await expect
      .poll(() => refetch(page, () => rowsInclude(LOG_SERVICE), /BudgetService\/Log/i), {
        timeout: 30_000,
      })
      .toBe(true);

    // Re-navigate then switch tab each poll — a reload resets back to Logs.
    await expect
      .poll(
        () =>
          refetch(
            page,
            async () => {
              await page.getByRole("tab", { name: /Traces/ }).click();
              return rowsInclude(TRACE_ROOT);
            },
            /BudgetService\/Trace/i,
          ),
        { timeout: 30_000 },
      )
      .toBe(true);
  });

  test("summary percentages and costs are internally consistent", async ({ page }) => {
    const summary = page.locator(".summary-table");
    await expect
      .poll(
        () =>
          refetch(page, async () => {
            const m = (await summary.innerText()).match(/(\d+(?:\.\d+)?)\s*%/);
            return m ? Number(m[1]) : 0;
          }),
        { timeout: 30_000 },
      )
      .toBeGreaterThan(0);

    // each row renders "<pct> % ... $<cost>" (% of Total, then the Total cost).
    const rows = [...(await summary.innerText()).matchAll(/(\d+(?:\.\d+)?)\s*%\s*\$([\d.,]+)/g)].map(
      (m) => ({ pct: Number(m[1]), cost: Number(m[2].replace(/,/g, "")) }),
    );
    expect(rows.length).toBeGreaterThanOrEqual(2); // Logs + Traces

    const totalText = await page
      .locator(".mdai-summary-table-toolbar")
      .getByText(/^\$/)
      .innerText();
    const total = Number(totalText.replace(/[^0-9.]/g, ""));

    // % of Total sums to 100.
    const pctSum = rows.reduce((acc, r) => acc + r.pct, 0);
    expect(pctSum).toBeGreaterThanOrEqual(99);
    expect(pctSum).toBeLessThanOrEqual(101);

    // row costs sum to the displayed total, and each row's % matches cost/total.
    const costSum = rows.reduce((acc, r) => acc + r.cost, 0);
    expect(Math.abs(costSum - total) / total).toBeLessThan(0.05);
    for (const r of rows) {
      expect(Math.abs((r.cost / total) * 100 - r.pct)).toBeLessThan(2);
    }
  });

  test("search filters the log table to services matching the query", async ({ page }) => {
    // Data rows by ARIA role (role=row containing gridcells), scoped to the
    // non-summary table — stable across MUI versions, unlike the .MuiDataGrid-row class.
    const rows = page
      .locator('.mdai-table:not(.summary-table) [role="row"]')
      .filter({ has: page.locator('[role="gridcell"]') });
    await expect
      .poll(() => refetch(page, () => rows.count(), /BudgetService\/Log/i), { timeout: 30_000 })
      .toBeGreaterThan(1);

    // The service is the log table's first column (MUI grid data-colindex 0).
    const serviceCells = page.locator(
      '.mdai-table:not(.summary-table) [role="row"] [role="gridcell"][data-colindex="0"]',
    );

    // Query the full service name of the first row (the most discriminating
    // choice from live data).
    const initial = await serviceCells.allInnerTexts();
    const query = initial[0].trim();
    expect(query.length).toBeGreaterThan(0);
    const q = query.toLowerCase();

    // The query must discriminate: some visible row must not match it, or a
    // "filter" that drops nothing would still satisfy the checks below.
    expect(initial.some((name) => !name.toLowerCase().includes(q))).toBe(true);
    const beforeCount = initial.length;

    await page.getByRole("combobox", { name: "Search for service" }).fill(query);

    // The table actually shrinks and every remaining row contains the query
    // (case-insensitive). Polling waits out the search debounce.
    await expect
      .poll(
        async () => {
          const names = await serviceCells.allInnerTexts();
          return (
            names.length > 0 &&
            names.length < beforeCount &&
            names.every((name) => name.toLowerCase().includes(q))
          );
        },
        { timeout: 15_000 },
      )
      .toBe(true);
  });

  test("clarity: a no-match search shows the empty state and Clear Search restores results", async ({ page }) => {
    const rows = page
      .locator('.mdai-table:not(.summary-table) [role="row"]')
      .filter({ has: page.locator('[role="gridcell"]') });
    await expect
      .poll(() => refetch(page, () => rows.count(), /BudgetService\/Log/i), { timeout: 30_000 })
      .toBeGreaterThan(0);

    // A query matching no service drops every row, so the tab shows the
    // no-results empty state (reached only when data is present, hence here).
    await page
      .getByRole("combobox", { name: "Search for service" })
      .fill("zzz-no-such-service-xyz");
    await expect(page.getByText("No results found")).toBeVisible({ timeout: 15_000 });

    // Clear Search restores the rows.
    await page.getByRole("button", { name: "Clear Search" }).click();
    await expect.poll(() => rows.count(), { timeout: 15_000 }).toBeGreaterThan(0);
  });

  test("system health: the connection validation completes under load", async ({ page }) => {
    test.setTimeout(5 * 60 * 1000);
    await page.goto("/system-health");
    // Run a fresh validation against the live load.
    const revalidate = page.getByRole("button", { name: "Revalidate", exact: true });
    await expect(revalidate).toBeVisible({ timeout: 2 * 60_000 });
    await revalidate.click();

    // The validation settles to a terminal status (not stuck "Validating"). The
    // Operational-vs-Error outcome is non-deterministic with dummy Datadog creds:
    // the fidelity validator intermittently fails data integrity ("telemetry does
    // not match expected validation results"). A real destination the validator
    // can check against (fakeintake spike) would make Operational deterministic.
    const connectionWidget = page.locator(".system-health-widget", {
      hasText: "Datadog connection",
    });
    await expect
      .poll(
        async () => {
          const text = await connectionWidget.innerText();
          return /Operational|Error/.test(text) && !/Validating/.test(text);
        },
        { timeout: 3 * 60_000, intervals: [3_000] },
      )
      .toBe(true);
  });
});
