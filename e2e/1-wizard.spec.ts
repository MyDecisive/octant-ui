import { execFileSync } from "node:child_process";
import { test, expect, type Page } from "@playwright/test";
import { env } from "./helpers/env";
import { kubectl } from "./helpers/kubectl";

// The connection's ArgoCD app must converge to Healthy (not Degraded) once the
// collectors it manages are created/updated.
async function expectConnectionAppHealthy(): Promise<void> {
  await expect
    .poll(
      () =>
        kubectl([
          "get", "application", "-n", "argocd", env.connectionName,
          "-o", "jsonpath={.status.health.status}",
        ]),
      { timeout: 120_000 },
    )
    .toBe("Healthy");
}

// Wait for the connection's ArgoCD app to finish any in-flight sync.
async function waitForArgoIdle(): Promise<void> {
  await expect
    .poll(
      () =>
        kubectl([
          "get", "application", "-n", "argocd", env.connectionName,
          "-o", "jsonpath={.status.operationState.phase}",
        ]),
      { timeout: 120_000 },
    )
    .not.toBe("Running");
}

test.describe.serial("octant install-and-connect smoke", () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    // Reset to the fresh-user wizard state. Octant persists the saved connection
    // in this ConfigMap; while it exists the app boots to the dashboard and
    // skips the wizard. The installed hub and collector are left in place, so
    // re-runs stay warm.
    kubectl(["delete", "configmap", "-n", "octant", "mdai-octant-connections", "--ignore-not-found"]);
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("splash loads and starts the wizard", async () => {
    await page.goto("/");
    await expect(page.getByText("Welcome to Octant")).toBeVisible();
    await page.getByRole("button", { name: "Let's Build" }).click();
    await expect(page).toHaveURL(/\/install\/1$/);
  });

  test("step 1: authorize ArgoCD app management", async () => {
    await expect(page.getByText("Deploy via ArgoCD")).toBeVisible();
    const next = page.getByRole("button", { name: "Next", exact: true });
    await expect(next).toBeDisabled();
    await page.getByRole("checkbox").check();
    await expect(next).toBeEnabled();
    await next.click();
    await expect(page).toHaveURL(/\/install\/2$/);
  });

  test("step 2: connect to cluster with derived ArgoCD creds", async () => {
    await expect(
      page.getByRole("heading", { name: "Connect to your Kubernetes Cluster" }),
    ).toBeVisible();
    await page.getByPlaceholder("Name this connection").fill(env.connectionName);
    await page.getByLabel("ArgoCD Cluster URL").fill(env.argoUrl);
    await page.getByLabel("ArgoCD API token").fill(env.argoToken);
    await page.getByRole("button", { name: "Verify & Connect", exact: true }).click();
    await expect(page.getByText("Connection Failed")).toHaveCount(0);
    await expect(page).toHaveURL(/\/install\/3$/, { timeout: 60_000 });
  });

  test("step 3: install Smarthub into the mdai namespace", async () => {
    test.setTimeout(12 * 60 * 1000);
    await expect(page.getByRole("heading", { name: "Deploy Smarthub" })).toBeVisible();
    await expect(page.getByLabel("Kubernetes Namespace")).toHaveValue("mdai");

    const deploy = page.getByRole("button", { name: "Deploy to Cluster", exact: true });
    const gotIt = page.getByRole("button", { name: "Got it", exact: true });

    // A cold hub install can exceed octant's MDAI_INSTALL_TIMEOUT (90s default),
    // which pops an "Install still in progress" modal even though the install
    // ultimately succeeds. Dismiss it and retry until the wizard advances;
    // installMDAIHub is idempotent and the retry re-polls the (eventually
    // healthy) app.
    const deadline = Date.now() + 10 * 60 * 1000;
    await deploy.click();
    while (
      !/\/install\/4$/.test(new URL(page.url()).pathname) &&
      Date.now() < deadline
    ) {
      if (await gotIt.isVisible().catch(() => false)) {
        await gotIt.click();
        await deploy.click();
      }
      await page.waitForTimeout(3000);
    }
    await expect(page).toHaveURL(/\/install\/4$/);

    // cluster: the hub ArgoCD app is healthy and hub workloads exist.
    expect(kubectl(["get", "application", "mdai", "-n", "argocd",
      "-o", "jsonpath={.status.health.status}"])).toBe("Healthy");
    expect(kubectl(["get", "deploy", "mdai-event-hub", "-n", env.namespace,
      "-o", "jsonpath={.metadata.name}"])).toBe("mdai-event-hub");
  });

  // Negative cases for step 4. Non-advancing: they leave the wizard on step 4 so
  // the happy-path deploy below (which re-checks the boxes and overwrites the
  // fields) runs from a clean slate regardless of what these leave behind.
  test("step 4: deploy is gated until a type, URL, and key are set", async () => {
    await expect(
      page.getByRole("heading", { name: "Configure Telemetry Routing" }),
    ).toBeVisible();
    const deploy = page.getByRole("button", { name: "Deploy Collector", exact: true });

    // No telemetry type selected: required values missing, so deploy is disabled.
    await expect(deploy).toBeDisabled();

    // A type selected but URL and key still empty: still disabled.
    await page.getByRole("checkbox", { name: "Logs" }).check();
    await expect(deploy).toBeDisabled();

    const url = page.getByPlaceholder("Destination URL");
    await url.fill("not a url");
    await url.blur();
    await expect(page.getByText(/Enter a valid URL/)).toBeVisible();
  });

  // Known bug: the backend requires a 32-char Datadog API key and rejects a
  // shorter one with invalid_argument, but DeployCollector swallows the error
  // (its catch returns false with a "TODO: We need error feedback" note), so the
  // form surfaces no inline error, alert, or toast — the user is stranded on step
  // 4 with no explanation. Expected-failure until the UI either validates the key
  // length client-side or surfaces the backend error. Runs before the valid
  // deploy below and leaves the form on step 4 for it.
  test("step 4: invalid Datadog API key fails silently", async () => {
    await expect(
      page.getByRole("heading", { name: "Configure Telemetry Routing" }),
    ).toBeVisible();
    await page.getByRole("checkbox", { name: "Logs" }).check();
    await page.getByRole("checkbox", { name: "Traces" }).check();
    await page.getByPlaceholder("Destination URL").fill(env.datadogUrl);
    await page.getByPlaceholder("Datadog API key").fill("too-short-key");

    // Confirm the backend actually rejected the short key (invalid_argument), so
    // the expected-failure below is about the swallowed error, not a skipped RPC.
    const savePromise = page.waitForResponse(
      (res) => res.url().includes("DatadogService/SaveDatadogIntegration"),
      { timeout: 30_000 },
    );
    await page.getByRole("button", { name: "Deploy Collector", exact: true }).click();
    const saveResponse = await savePromise;
    expect(saveResponse.status()).toBe(400); // ConnectRPC maps invalid_argument -> 400
    expect(await saveResponse.text()).toContain("invalid_argument");

    // The known bug: that rejection surfaces no UI feedback. Detect whether the
    // "must be 32 characters" message appears (that wording, not the ever-present
    // "Datadog API key" label) and mark expected-failure only when it is genuinely
    // absent — so a selector/navigation regression fails loudly, not masked.
    await expect(page).toHaveURL(/\/install\/4$/);
    const errorShown = await page
      .getByText(/32 characters/i)
      .waitFor({ state: "visible", timeout: 5_000 })
      .then(() => true)
      .catch(() => false);
    test.fail(!errorShown, "DeployCollector swallows the invalid-key error (no inline error/alert/toast)");
    expect(errorShown, "the invalid-key error should be surfaced").toBe(true);
  });

  test("step 4: deploy collector with dummy Datadog creds", async () => {
    await expect(
      page.getByRole("heading", { name: "Configure Telemetry Routing" }),
    ).toBeVisible();
    await page.getByRole("checkbox", { name: "Logs" }).check();
    await page.getByRole("checkbox", { name: "Traces" }).check();
    await page.getByPlaceholder("Destination URL").fill(env.datadogUrl);
    await page.getByPlaceholder("Datadog API key").fill(env.datadogApiKey);
    await page.getByRole("button", { name: "Deploy Collector", exact: true }).click();
    await expect(page).toHaveURL(/\/install\/5$/, { timeout: 2 * 60 * 1000 });

    // cluster: the Datadog integration secret and the sampling collectors are
    // created. Poll — on a cold cluster the operator materializes them a few
    // seconds after the UI advances (`--ignore-not-found` returns "" until then).
    await expect
      .poll(() => kubectl(["get", "secret", `${env.connectionName}-integration-secret`,
        "-n", env.namespace, "-o", "jsonpath={.metadata.name}", "--ignore-not-found"]),
        { timeout: 90_000 })
      .toBe(`${env.connectionName}-integration-secret`);
    for (const kind of ["log-sampling", "trace-sampling"]) {
      await expect
        .poll(() => kubectl(["get", "opentelemetrycollector", `${env.connectionName}-${kind}`,
          "-n", env.namespace, "-o", "jsonpath={.metadata.name}", "--ignore-not-found"]),
          { timeout: 90_000 })
        .toBe(`${env.connectionName}-${kind}`);
    }

    // the connection's argo app converges to Healthy after the collectors exist.
    await expectConnectionAppHealthy();
  });

  test("step 5: acknowledge agent configuration", async () => {
    await expect(
      page.getByRole("heading", { name: "Configure the Datadog Agent" }),
    ).toBeVisible();
    await expect(page.getByText("SmartHub Internal Endpoint")).toBeVisible();
    await expect(
      page.getByText("Example Datadog Agent Configuration"),
    ).toBeVisible();
    // content: the snippet carries the real in-cluster Smarthub forwarder.
    await expect(
      page.getByText(/mdai-envoy\.mdai\.svc\.cluster\.local:8126/).first(),
    ).toBeVisible();
    await page
      .getByRole("checkbox", {
        name: "I have applied these changes and restarted the Datadog agent",
      })
      .check();

    // Let step 4's connection sync settle so the verify creates a fresh
    // validator run (instead of reusing a stale one on an argo conflict).
    await waitForArgoIdle();
    await page.getByRole("button", { name: "Verify Connection", exact: true }).click();
    await expect(page).toHaveURL(/\/install\/6$/);
  });

  test("step 6: verification outcome reflects whether telemetry is flowing", async () => {
    test.setTimeout(8 * 60 * 1000);
    await expect(
      page.getByRole("heading", { name: "Testing data flow in our Smarthub" }),
    ).toBeVisible();
    const next = page.getByRole("button", { name: "Next", exact: true });
    await expect(next).toBeEnabled({ timeout: 6 * 60 * 1000 });

    // Outcome check. No telemetry flows during the install, so verification
    // reports the failure outcome. (The validator/operational path is exercised
    // under load in 4-load; reaching operational is non-deterministic and not
    // asserted here.)
    const connection = page.locator(".health-widget-container", { hasText: "Datadog connection" });
    await expect(connection.getByText("Error", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();

    await next.click();
    await expect(page).toHaveURL(/\/install\/7$/);
  });

  test("step 7: next steps, manifest download, and go to Clarity", async () => {
    await expect(page.getByRole("heading", { name: "Next Steps" })).toBeVisible();
    await expect(page.getByText("View your Clarity Dashboard")).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Download Manifests (.zip)" }).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.zip$/);

    // content: the zip carries real connection manifests, not an empty file.
    await download.saveAs("e2e/.tmp/manifests.zip");
    const contents = execFileSync("unzip", ["-p", "e2e/.tmp/manifests.zip"], {
      encoding: "utf8",
    });
    expect(contents).toMatch(/kind:\s*OpenTelemetryCollector/);

    await page.getByRole("button", { name: "Go to Clarity" }).click();
    await expect(page).toHaveURL(/\/clarity$/);

    // A freshly-installed connection has no telemetry yet, so Clarity shows the
    // configured-but-no-data empty state, whose action links to System Health.
    const review = page.getByRole("button", { name: "Review in System Health" });
    await expect(review).toBeVisible({ timeout: 60_000 });
    await review.click();
    await expect(page).toHaveURL(/\/system-health$/);
  });
});
