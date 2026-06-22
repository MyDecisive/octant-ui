import { test, expect, type Locator } from "@playwright/test";

// Data-dependent assertions. These run only after `e2e/load.sh up` has generated
// traffic through the Smarthub collector (gate: OCTANT_DEMO_LOAD=1). No Datadog
// API key is present in this process — the key lives only in load.sh and the
// octant-demo binary. See e2e/README.md.
test.describe("clarity under load", () => {
  test.skip(
    process.env.OCTANT_DEMO_LOAD !== "1",
    "run e2e/load.sh up first, then: OCTANT_DEMO_LOAD=1 npx playwright test e2e/4-load.spec.ts",
  );

  // Reads a filter-card metric row (e.g. "Ingested 0.46 GB") as a number.
  async function metric(card: Locator, label: string): Promise<number> {
    const match = (await card.innerText()).match(new RegExp(`${label}\\s+([\\d.]+)`));
    return match ? Number(match[1]) : 0;
  }

  // Auto warm-up. The data-dependent assertions need accumulated throughput; for
  // the first few minutes after the load stand starts, volume is too small —
  // log GB rounds to 0.00 and small costs make the per-row pct/cost rounding
  // diverge. Poll the log card's Ingested (the slowest signal to register) until
  // it is non-zero, capped at 3 min, so an already-warm cluster proceeds at once.
  test.beforeAll(async ({ browser }) => {
    if (process.env.OCTANT_DEMO_LOAD !== "1") return;
    const page = await browser.newPage();
    try {
      await page.goto("/clarity");
      const logCard = page.locator(".filter-card-container", { hasText: "Log filters" });
      await expect
        .poll(() => metric(logCard, "Ingested"), {
          timeout: 3 * 60_000,
          intervals: [5_000],
        })
        .toBeGreaterThan(0);
    } finally {
      await page.close();
    }
  });

  test("log filter metrics populate from collector throughput", async ({ page }) => {
    await page.goto("/clarity");
    await expect(page).toHaveURL(/\/clarity$/);

    const logCard = page.locator(".filter-card-container", { hasText: "Log filters" });
    await expect(logCard).toBeVisible();

    // Ingested and Routed are 0 when idle and climb above 0 once the load
    // generator drives traffic through the collector and octant aggregates it.
    await expect
      .poll(() => metric(logCard, "Ingested"), { timeout: 90_000 })
      .toBeGreaterThan(0);
    expect(await metric(logCard, "Routed")).toBeGreaterThan(0);
  });

  test("summary shows a non-zero ingest cost total", async ({ page }) => {
    await page.goto("/clarity");
    await expect(page).toHaveURL(/\/clarity$/);

    // The summary toolbar renders the total as "$<value>" ("$-" when idle).
    const total = page.locator(".mdai-summary-table-toolbar").getByText(/^\$/);
    await expect
      .poll(
        async () => {
          const text = await total.innerText().catch(() => "$-");
          return Number(text.replace(/[^0-9.]/g, "")) || 0;
        },
        { timeout: 90_000 },
      )
      .toBeGreaterThan(0);
  });

  test("log and trace tables populate with sources", async ({ page }) => {
    await page.goto("/clarity");
    await expect(page).toHaveURL(/\/clarity$/);

    // Data rows by ARIA role (role=row containing gridcells), scoped to the
    // non-summary table — stable across MUI versions, unlike the .MuiDataGrid-row class.
    const rows = page
      .locator('.mdai-table:not(.summary-table) [role="row"]')
      .filter({ has: page.locator('[role="gridcell"]') });
    await expect.poll(() => rows.count(), { timeout: 90_000 }).toBeGreaterThan(0);

    await page.getByRole("tab", { name: /Traces/ }).click();
    await expect.poll(() => rows.count(), { timeout: 60_000 }).toBeGreaterThan(0);
  });

  test("summary percentages and costs are internally consistent", async ({ page }) => {
    await page.goto("/clarity");
    await expect(page).toHaveURL(/\/clarity$/);

    const summary = page.locator(".summary-table");
    // wait for data to populate the summary.
    await expect
      .poll(async () => {
        const m = (await summary.innerText()).match(/(\d+(?:\.\d+)?)\s*%/);
        return m ? Number(m[1]) : 0;
      }, { timeout: 90_000 })
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
    await page.goto("/clarity");
    await expect(page).toHaveURL(/\/clarity$/);

    // Data rows by ARIA role (role=row containing gridcells), scoped to the
    // non-summary table — stable across MUI versions, unlike the .MuiDataGrid-row class.
    const rows = page
      .locator('.mdai-table:not(.summary-table) [role="row"]')
      .filter({ has: page.locator('[role="gridcell"]') });
    await expect.poll(() => rows.count(), { timeout: 90_000 }).toBeGreaterThan(1);

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
});
