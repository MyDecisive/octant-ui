import { randomUUID } from "node:crypto";
import { test, expect, type Page } from "@playwright/test";
import { env } from "./helpers/env";
import { kubectl } from "./helpers/kubectl";

// Reads the connection's variables ConfigMap, which the sampling collectors
// consume via envFrom. This is the k8s source of truth for an applied filter.
function readCollectorVariables(): Record<string, string> {
  return JSON.parse(
    kubectl(["get", "configmap", `${env.connectionName}-variables`,
      "-n", env.namespace, "-o", "jsonpath={.data}"]),
  ) as Record<string, string>;
}

// The deployment generation increments each time the otel-operator rolls the
// collector to adopt a changed config; used to prove the filter reached it.
function collectorGeneration(deployment: string): number {
  return Number(
    kubectl(["get", "deployment", deployment,
      "-n", env.namespace, "-o", "jsonpath={.metadata.generation}"]),
  );
}

// The Datadog destination URL the connection's integration secret holds — the
// cluster source of truth for a Settings "Update settings" action.
function readSiteUrl(): string {
  const b64 = kubectl(["get", "secret", `${env.connectionName}-integration-secret`,
    "-n", env.namespace, "-o", "jsonpath={.data.site-url}"]);
  return Buffer.from(b64, "base64").toString("utf8");
}

// The integration secret's resourceVersion bumps whenever octant rewrites it.
// Proves a key-only Settings update changed the secret without reading its data.
function secretResourceVersion(): string {
  return kubectl(["get", "secret", `${env.connectionName}-integration-secret`,
    "-n", env.namespace, "-o", "jsonpath={.metadata.resourceVersion}"]);
}

// The stored api-key, base64-encoded exactly as the Secret holds it. Compared
// against the base64 of the submitted key, so the raw value is never decoded.
function readApiKeyBase64(): string {
  return kubectl(["get", "secret", `${env.connectionName}-integration-secret`,
    "-n", env.namespace, "-o", "jsonpath={.data.api-key}"]);
}

// The connection's stored telemetry types (connections ConfigMap, octant ns) —
// the source of truth a Settings telemetry-type change updates. Used instead of
// collector presence because the connection app syncs with prune off, so a
// removed collector lingers. Returns [] on any transient read error so callers
// can poll.
function readConnectionTelemetryTypes(): string[] {
  try {
    const json = kubectl(["get", "configmap", "mdai-octant-connections", "-n", "octant",
      "-o", `jsonpath={.data.${env.connectionName}}`]);
    return (JSON.parse(json) as { telemetryTypes?: string[] }).telemetryTypes ?? [];
  } catch {
    return [];
  }
}

// After a mutation settles, the connection's ArgoCD app must converge to
// Healthy (not Degraded) — a degraded app means the change broke the collectors
// even if the UI looked fine.
async function expectConnectionAppHealthy(): Promise<void> {
  await expect
    .poll(() => kubectl(["get", "application", "-n", "argocd", env.connectionName,
      "-o", "jsonpath={.status.health.status}"]), { timeout: 120_000 })
    .toBe("Healthy");
}

// octant cannot run concurrent operations on the connection's ArgoCD app; a
// filter change can leave a sync in flight. Wait for it to finish before an
// action that triggers its own sync (e.g. Settings update).
async function waitForArgoIdle(): Promise<void> {
  await expect
    .poll(() => kubectl(["get", "application", "-n", "argocd", env.connectionName,
      "-o", "jsonpath={.status.operationState.phase}"]), { timeout: 120_000 })
    .not.toBe("Running");
}

// Restore both telemetry types via the Settings flow. Idempotent: a no-op when
// the connection already carries logs+traces (e.g. a change that never applied).
// Used in a finally so a failed telemetry-type test cannot leave it logs-only.
async function restoreBothTelemetryTypes(page: Page): Promise<void> {
  if (readConnectionTelemetryTypes().sort().join(",") === "logs,traces") return;
  await page.goto("/settings");
  await expect(page.getByRole("checkbox", { name: "Logs" })).toBeChecked({ timeout: 30_000 });
  await page.getByRole("checkbox", { name: "Traces" }).check();
  const update = page.getByRole("button", { name: "Update settings" });
  await expect(update).toBeEnabled();
  await waitForArgoIdle();
  await update.click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "I've updated my Datadog agent" })
    .click();
  await expect(page.getByText("New settings applied")).toBeVisible({ timeout: 90_000 });
  await expect
    .poll(() => readConnectionTelemetryTypes().sort(), { timeout: 60_000 })
    .toEqual(["logs", "traces"]);
  await expectConnectionAppHealthy();
}

// These tests run against an existing octant connection (created by the wizard
// spec). They do not reset state, so they can be iterated on their own with
//   npx playwright test e2e/2-dashboard.spec.ts
// provided a connection already exists.
test.describe.serial("octant post-install dashboard", () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    // Without a connection, octant routes /clarity back to the install flow.
    await page.goto("/clarity");
    try {
      await page.waitForURL(/\/clarity$/, { timeout: 10_000 });
    } catch {
      throw new Error(
        "No octant connection found; run the wizard first (npm run e2e:smoke).",
      );
    }
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("clarity: apply a log filter and verify it reaches the collector", async () => {
    const card = page.locator(".filter-card-container", { hasText: "Log filters" });
    await expect(card).toBeVisible(); // log card is expanded by default
    const toggle = card.getByRole("switch");
    const apply = card.getByRole("button", { name: "Apply" });
    const collector = `${env.connectionName}-log-sampling-collector`;

    const before = readCollectorVariables().LOGS_PERSIST_ERRORS;
    const expected = before === "true" ? "false" : "true";
    const genBefore = collectorGeneration(collector);

    await expect(apply).toBeDisabled(); // nothing staged yet
    await toggle.click(); // toggle "Always keep errors"
    await expect(apply).toBeEnabled(); // a real change was staged
    await apply.click();

    // The value lands in the variables ConfigMap and the otel-operator rolls the
    // log sampling collector to adopt it.
    await expect
      .poll(() => readCollectorVariables().LOGS_PERSIST_ERRORS, { timeout: 60_000 })
      .toBe(expected);
    await expect
      .poll(() => collectorGeneration(collector), { timeout: 60_000 })
      .toBeGreaterThan(genBefore);

    // the connection's argo app must stay healthy after the change.
    await expectConnectionAppHealthy();

    // UI confirms success too (not just the cluster): once the update completes
    // the title's "Keep errors" chip reflects the applied include-errors state
    // (present when kept, absent when not). A failed apply leaves the old state
    // and fails here, catching a broken user experience.
    await expect(card.getByRole("progressbar")).toHaveCount(0, { timeout: 65_000 });
    if (expected === "true") {
      await expect(card).toContainText("Keep errors", { timeout: 30_000 });
    } else {
      await expect(card).not.toContainText("Keep errors", { timeout: 30_000 });
    }
  });

  test("clarity: apply a trace filter and verify it reaches the collector", async () => {
    const card = page.locator(".filter-card-container", { hasText: "Trace filters" });
    await expect(card).toBeVisible();
    // The trace card is collapsed by default; expand it to reach the controls.
    await card.getByRole("button", { name: /Trace filters/ }).click();

    const toggle = card.getByRole("switch");
    const apply = card.getByRole("button", { name: "Apply" });
    const collector = `${env.connectionName}-trace-sampling-collector`;

    // Capture the real k8s state, flip the filter via the UI, then prove the
    // change actually reached the collector. We verify the k8s effect rather
    // than the UI's "completed" state: a single apply completes within octant's
    // 60s window, but the log and trace collectors share one ConfigMap, so
    // back-to-back changes can overlap past it. The k8s check is robust either
    // way (see the design doc's Findings).
    const before = readCollectorVariables().TRACES_PERSIST_ERRORS;
    const expected = before === "true" ? "false" : "true";
    const genBefore = collectorGeneration(collector);

    await toggle.click(); // toggle "Always keep errors"
    await expect(apply).toBeEnabled(); // a real change was staged
    await apply.click();

    // 1. The applied value lands in the variables ConfigMap the collector reads.
    await expect
      .poll(() => readCollectorVariables().TRACES_PERSIST_ERRORS, {
        timeout: 60_000,
      })
      .toBe(expected);
    // 2. The otel-operator rolls the trace sampling collector to adopt it.
    await expect
      .poll(() => collectorGeneration(collector), { timeout: 60_000 })
      .toBeGreaterThan(genBefore);

    // the connection's argo app must stay healthy after the change.
    await expectConnectionAppHealthy();

    // UI confirms success too (not just the cluster): once the update completes
    // the title's "Keep errors" chip reflects the applied include-errors state
    // (present when kept, absent when not). A failed apply leaves the old state
    // and fails here, catching a broken user experience.
    await expect(card.getByRole("progressbar")).toHaveCount(0, { timeout: 65_000 });
    if (expected === "true") {
      await expect(card).toContainText("Keep errors", { timeout: 30_000 });
    } else {
      await expect(card).not.toContainText("Keep errors", { timeout: 30_000 });
    }
  });

  test("clarity: set a log sampling rate and verify the collector ratio", async () => {
    const card = page.locator(".filter-card-container", { hasText: "Log filters" });
    await expect(card).toBeVisible();
    const slider = card.getByRole("slider");
    const apply = card.getByRole("button", { name: "Apply" });

    // A prior filter apply may still be propagating; wait until the card is idle
    // (the Apply/Cancel loading spinner — an ARIA progressbar — is gone).
    await expect(card.getByRole("progressbar")).toHaveCount(0, { timeout: 65_000 });

    // Pick a target distinct from the current applied value so Apply enables.
    const before = readCollectorVariables().LOGS_RATIO_NUMBER;
    const target = before === "50" ? "75" : "50";

    await slider.focus();
    await slider.press("Home"); // -> 0
    for (let i = 0; i < Number(target); i++) await slider.press("ArrowRight");
    await expect(slider).toHaveAttribute("aria-valuenow", target);

    await expect(apply).toBeEnabled();
    await apply.click();

    // The sampling percentage lands in the variables ConfigMap the log
    // collector consumes (sampling_percentage: ${env:LOGS_RATIO_NUMBER}).
    await expect
      .poll(() => readCollectorVariables().LOGS_RATIO_NUMBER, { timeout: 60_000 })
      .toBe(target);

    await expectConnectionAppHealthy();

    // UI confirms the rate apply completed: the title shows the new sampling %.
    await expect(card.getByRole("progressbar")).toHaveCount(0, { timeout: 65_000 });
    await expect(card).toContainText(`${target}%`, { timeout: 30_000 });
  });

  test("clarity: cancel reverts a staged filter change without applying", async () => {
    const card = page.locator(".filter-card-container", { hasText: "Log filters" });
    const toggle = card.getByRole("switch");
    const apply = card.getByRole("button", { name: "Apply" });
    const cancel = card.getByRole("button", { name: "Cancel" });

    // Wait until any prior filter apply has settled (loading spinner gone).
    await expect(card.getByRole("progressbar")).toHaveCount(0, { timeout: 65_000 });

    const before = readCollectorVariables().LOGS_PERSIST_ERRORS;
    const wasChecked = await toggle.isChecked();

    await toggle.click(); // stage a change
    await expect(apply).toBeEnabled();
    await cancel.click(); // revert without applying

    await expect(apply).toBeDisabled();
    expect(await toggle.isChecked()).toBe(wasChecked); // UI reverted
    expect(readCollectorVariables().LOGS_PERSIST_ERRORS).toBe(before); // no cluster write
  });

  test("clarity: set a trace sampling rate and verify the collector ratio", async () => {
    const card = page.locator(".filter-card-container", { hasText: "Trace filters" });
    await expect(card).toBeVisible();
    // Trace card is collapsed by design; expand it to reach the controls.
    if ((await card.getByRole("slider").count()) === 0) {
      await card.getByRole("button", { name: /Trace filters/ }).click();
    }
    await expect(card.getByRole("progressbar")).toHaveCount(0, { timeout: 65_000 });

    const slider = card.getByRole("slider");
    const apply = card.getByRole("button", { name: "Apply" });
    const before = readCollectorVariables().TRACES_RATIO_NUMBER;
    const target = before === "50" ? "75" : "50";

    await slider.focus();
    await slider.press("Home"); // -> 0
    for (let i = 0; i < Number(target); i++) await slider.press("ArrowRight");
    await expect(slider).toHaveAttribute("aria-valuenow", target);

    await expect(apply).toBeEnabled();
    await apply.click();

    await expect
      .poll(() => readCollectorVariables().TRACES_RATIO_NUMBER, { timeout: 60_000 })
      .toBe(target);
    await expectConnectionAppHealthy();

    // UI: the title shows the new % (header chip, visible even after the trace
    // card collapses on apply — the collapse is by design).
    await expect(card).toContainText(`${target}%`, { timeout: 30_000 });
  });

  test("clarity: cancel reverts a staged trace filter change", async () => {
    const card = page.locator(".filter-card-container", { hasText: "Trace filters" });
    if ((await card.getByRole("switch").count()) === 0) {
      await card.getByRole("button", { name: /Trace filters/ }).click();
    }
    await expect(card.getByRole("progressbar")).toHaveCount(0, { timeout: 65_000 });

    const toggle = card.getByRole("switch");
    const apply = card.getByRole("button", { name: "Apply" });
    const cancel = card.getByRole("button", { name: "Cancel" });

    const before = readCollectorVariables().TRACES_PERSIST_ERRORS;
    const wasChecked = await toggle.isChecked();

    await toggle.click(); // stage a change
    await expect(apply).toBeEnabled();
    await cancel.click(); // revert without applying (no remount, card stays open)

    await expect(apply).toBeDisabled();
    expect(await toggle.isChecked()).toBe(wasChecked); // UI reverted
    expect(readCollectorVariables().TRACES_PERSIST_ERRORS).toBe(before); // no cluster write
  });

  test("clarity: cancel after moving the slider reverts it without applying", async () => {
    const card = page.locator(".filter-card-container", { hasText: "Log filters" });
    await expect(card).toBeVisible();
    await expect(card.getByRole("progressbar")).toHaveCount(0, { timeout: 65_000 });

    const slider = card.getByRole("slider");
    const apply = card.getByRole("button", { name: "Apply" });
    const cancel = card.getByRole("button", { name: "Cancel" });

    const before = readCollectorVariables().LOGS_RATIO_NUMBER;
    const beforeAria = (await slider.getAttribute("aria-valuenow")) ?? "";

    await slider.focus();
    await slider.press(Number(beforeAria) < 100 ? "ArrowRight" : "ArrowLeft");
    await expect(slider).not.toHaveAttribute("aria-valuenow", beforeAria);
    await expect(apply).toBeEnabled();

    await cancel.click();

    await expect(apply).toBeDisabled();
    await expect(slider).toHaveAttribute("aria-valuenow", beforeAria); // UI reverted
    expect(readCollectorVariables().LOGS_RATIO_NUMBER).toBe(before); // no cluster write
  });

  test("clarity: apply a log sampling rate and keep-errors in one update", async () => {
    const card = page.locator(".filter-card-container", { hasText: "Log filters" });
    await expect(card).toBeVisible();
    await expect(card.getByRole("progressbar")).toHaveCount(0, { timeout: 65_000 });

    const slider = card.getByRole("slider");
    const toggle = card.getByRole("switch");
    const apply = card.getByRole("button", { name: "Apply" });
    const collector = `${env.connectionName}-log-sampling-collector`;

    const vars = readCollectorVariables();
    const rateTarget = vars.LOGS_RATIO_NUMBER === "40" ? "60" : "40";
    const persistTarget = vars.LOGS_PERSIST_ERRORS === "true" ? "false" : "true";
    const genBefore = collectorGeneration(collector);

    // Stage a rate change and an errors-toggle, then apply both at once.
    await slider.focus();
    await slider.press("Home");
    for (let i = 0; i < Number(rateTarget); i++) await slider.press("ArrowRight");
    await expect(slider).toHaveAttribute("aria-valuenow", rateTarget);
    await toggle.click();
    await expect(apply).toBeEnabled();
    await apply.click();

    // Both values land in the variables ConfigMap from the single apply, and the
    // operator rolls the collector to adopt them.
    await expect
      .poll(() => readCollectorVariables().LOGS_RATIO_NUMBER, { timeout: 60_000 })
      .toBe(rateTarget);
    expect(readCollectorVariables().LOGS_PERSIST_ERRORS).toBe(persistTarget);
    await expect
      .poll(() => collectorGeneration(collector), { timeout: 60_000 })
      .toBeGreaterThan(genBefore);
    await expectConnectionAppHealthy();

    // UI confirms both: the title shows the new rate and the keep-errors chip.
    await expect(card.getByRole("progressbar")).toHaveCount(0, { timeout: 65_000 });
    await expect(card).toContainText(`${rateTarget}%`, { timeout: 30_000 });
    if (persistTarget === "true") {
      await expect(card).toContainText("Keep errors", { timeout: 30_000 });
    } else {
      await expect(card).not.toContainText("Keep errors", { timeout: 30_000 });
    }
  });

  test("clarity: log sampling rate accepts the 0% and 100% bounds", async () => {
    const card = page.locator(".filter-card-container", { hasText: "Log filters" });
    await expect(card).toBeVisible();
    const slider = card.getByRole("slider");
    const apply = card.getByRole("button", { name: "Apply" });

    for (const target of ["0", "100"]) {
      await expect(card.getByRole("progressbar")).toHaveCount(0, { timeout: 65_000 });
      if (readCollectorVariables().LOGS_RATIO_NUMBER === target) continue;
      await slider.focus();
      await slider.press(target === "0" ? "Home" : "End");
      await expect(slider).toHaveAttribute("aria-valuenow", target);
      await expect(apply).toBeEnabled();
      await apply.click();
      await expect
        .poll(() => readCollectorVariables().LOGS_RATIO_NUMBER, { timeout: 60_000 })
        .toBe(target);
      // Each bound (including 0%) must keep the connection's argo app Healthy —
      // asserted per-iteration, not once after the last value. A sampling-rate
      // change is ConfigMap-driven via envFrom, so it does not roll the collector
      // deployment (unlike a keep-errors toggle); there is no generation bump.
      await expectConnectionAppHealthy();
    }
  });

  test("clarity: switch tabs and use search", async () => {
    await page.getByRole("tab", { name: "Traces" }).click();
    await page.getByRole("tab", { name: "Logs" }).click();
    const search = page.getByRole("combobox", { name: "Search for service" });
    await expect(search).toBeVisible();
    await search.fill("nonexistent-service");
    await expect(search).toHaveValue("nonexistent-service");
    await search.fill("");
  });

  test("system health reports the smarthub infrastructure operational", async () => {
    await page.goto("/system-health");
    await expect(page.getByRole("heading", { name: "System Health" })).toBeVisible();
    await expect(page.getByText("Datadog connection")).toBeVisible();

    // "Operational" reflects the running collectors/hub. Tolerate a transient
    // rollout from the preceding filter tests that toggle the collectors.
    const smarthub = page.locator(".system-health-widget", {
      hasText: "Smarthub Infrastructure",
    });
    await expect(smarthub).toContainText("Operational", { timeout: 60_000 });
  });

  test("settings config preview renders the connection's collector manifest", async () => {
    await page.goto("/settings");
    await expect(page.getByText("Configure Telemetry Routing")).toBeVisible();
    await expect(page.getByText("kind: OpenTelemetryCollector")).toBeVisible();
    await expect(page.getByText(`name: ${env.connectionName}`)).toBeVisible();
  });

  test("settings update changes the destination in the integration secret", async () => {
    await page.goto("/settings");
    const urlField = page.getByPlaceholder("Destination URL");
    await expect(urlField).toHaveValue(/datadoghq/, { timeout: 30_000 }); // loaded from the saved integration

    // Flip to a value different from the field's current one (guarantees a real
    // change so Update enables), then confirm it lands in the cluster secret the
    // collector reads. Verifies the applied value, not the UI completion (the
    // update waits on a collector rollout, same as filters).
    const current = await urlField.inputValue();
    const next = current.includes("datadoghq.eu")
      ? "https://app.datadoghq.com"
      : "https://app.datadoghq.eu";
    await urlField.fill(next);

    const update = page.getByRole("button", { name: "Update settings" });
    await expect(update).toBeEnabled();

    // octant rejects the update if a prior filter sync is still running.
    await waitForArgoIdle();
    await update.click();

    // UI confirms success too (not just the cluster): the success toast appears.
    await expect(page.getByText("New settings applied")).toBeVisible({ timeout: 90_000 });

    // cluster: the new destination landed in the integration secret.
    await expect.poll(() => readSiteUrl(), { timeout: 30_000 }).toBe(next);

    await expectConnectionAppHealthy();
  });

  test("settings masks the saved API key and disables update when unchanged", async () => {
    await page.goto("/settings");
    const apiKeyField = page.getByPlaceholder("Datadog API key");
    // The saved key is shown masked, never in clear text.
    await expect(apiKeyField).toHaveValue(/^\*+$/, { timeout: 30_000 });
    // A masked key counts as no change, so an untouched form cannot be submitted.
    await expect(page.getByRole("button", { name: "Update settings" })).toBeDisabled();
  });

  test("settings updates only the API key, leaving the destination URL", async () => {
    await page.goto("/settings");
    const apiKeyField = page.getByPlaceholder("Datadog API key");
    await expect(apiKeyField).toHaveValue(/^\*+$/, { timeout: 30_000 });

    const urlBefore = readSiteUrl();
    const rvBefore = secretResourceVersion();

    // A fresh 32-char key each run (UUID hex), so it always differs from the
    // stored one and the backend treats it as a real change.
    const newKey = randomUUID().replace(/-/g, "");
    await apiKeyField.fill(newKey);
    const update = page.getByRole("button", { name: "Update settings" });
    await expect(update).toBeEnabled();

    // octant rejects the update if a prior sync is still running.
    await waitForArgoIdle();
    await update.click();

    await expect(page.getByText("New settings applied")).toBeVisible({ timeout: 90_000 });

    // cluster: the secret was rewritten, now holds exactly the submitted key, and
    // the destination URL is unchanged — so only the key changed. A rewrite that
    // dropped or ignored the key fails the key check (the resourceVersion bump
    // alone would not). The key is compared base64-encoded, never decoded.
    await expect.poll(() => secretResourceVersion(), { timeout: 30_000 }).not.toBe(rvBefore);
    expect(readApiKeyBase64()).toBe(Buffer.from(newKey).toString("base64"));
    expect(readSiteUrl()).toBe(urlBefore);
    await expectConnectionAppHealthy();

    // the key re-masks after a successful update.
    await expect(apiKeyField).toHaveValue(/^\*+$/, { timeout: 30_000 });
  });

  test("settings telemetry-type change opens the agent dialog and updates the connection", async () => {
    try {
      // Remove Traces (logs-only): the type change opens the agent-update dialog,
      // and the connection's stored telemetry types drop traces.
      await page.goto("/settings");
      const traces = page.getByRole("checkbox", { name: "Traces" });
      await expect(traces).toBeChecked({ timeout: 30_000 });

      await traces.uncheck();
      const update = page.getByRole("button", { name: "Update settings" });
      await expect(update).toBeEnabled();
      await waitForArgoIdle();
      await update.click();

      // The agent-update dialog opens because the telemetry types changed.
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expect(dialog.getByText("Update your Datadog agent", { exact: true })).toBeVisible();
      await dialog.getByRole("button", { name: "I've updated my Datadog agent" }).click();

      await expect(page.getByText("New settings applied")).toBeVisible({ timeout: 90_000 });
      await expect
        .poll(() => readConnectionTelemetryTypes().sort(), { timeout: 60_000 })
        .toEqual(["logs"]);
      await expectConnectionAppHealthy();
    } finally {
      // Always restore logs+traces, even if an assertion above failed, so a
      // logs-only connection cannot break later tests or reruns.
      await restoreBothTelemetryTypes(page);
    }
  });

  test("settings download manifests triggers a download", async () => {
    await page.goto("/settings");
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Download manifests" }).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.(zip|ya?ml)$/);
  });

  test("unknown route shows the 404 view", async () => {
    await page.goto("/no-such-route");
    await expect(page.getByText("Uh oh!")).toBeVisible();
  });
});
