import { test, expect, type Page } from "@playwright/test";
import { env } from "./helpers/env";
import { kubectl } from "./helpers/kubectl";

// Wizard guard rails, exercised on a fresh no-connection state. None of these
// tests create a connection.
test.describe("wizard guards", () => {
  // Clear the saved connection so these run from the no-connection state, even
  // when this file is run directly / with --grep / under reordering — rather
  // than relying on 0-findings having run first.
  test.beforeAll(() => {
    kubectl(["delete", "configmap", "-n", "octant", "mdai-octant-connections", "--ignore-not-found"]);
  });

  // Walk to step 2 the way a user does (step 1 authorize first); deep-linking
  // /install/2 without it leaves the form incomplete.
  async function gotoConnectStep(page: Page) {
    await page.goto("/");
    await page.getByRole("button", { name: "Let's Build" }).click();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await expect(page).toHaveURL(/\/install\/2$/);
    await expect(
      page.getByRole("heading", { name: "Connect to your Kubernetes Cluster" }),
    ).toBeVisible();
  }

  test("deep-linking a gated step redirects back to connect", async ({ page }) => {
    // Step 5 requires connection/namespace/telemetry state that does not exist.
    await page.goto("/install/5");
    await expect(page).toHaveURL(/\/install\/2$/);
  });

  test("step 2 shows a validation error for an invalid URL", async ({ page }) => {
    await gotoConnectStep(page);
    const url = page.getByLabel("ArgoCD Cluster URL");
    await url.fill("not a url");
    await url.blur();
    await expect(page.getByText(/Enter a valid URL/)).toBeVisible();
  });

  test("step 2 rejects invalid ArgoCD credentials", async ({ page }) => {
    await gotoConnectStep(page);
    const name = page.getByPlaceholder("Name this connection");
    const url = page.getByLabel("ArgoCD Cluster URL");
    const token = page.getByLabel("ArgoCD API token");
    await name.fill("octant-e2e-bad");
    await name.blur();
    await url.fill(env.argoUrl);
    await url.blur();
    await token.fill("definitely-not-a-valid-token");
    await token.blur();

    const cta = page.getByRole("button", { name: "Verify & Connect", exact: true });
    await expect(cta).toBeEnabled();
    await cta.click();

    // testConnection returns unauthenticated -> the form surfaces the failure
    // and does not advance.
    await expect(page.getByText("Connection Failed")).toBeVisible();
    await expect(page).toHaveURL(/\/install\/2$/);
  });

  test("step 2 enables submit on an empty form but blocks the empty submit", async ({ page }) => {
    await gotoConnectStep(page);
    const cta = page.getByRole("button", { name: "Verify & Connect", exact: true });
    // formIsValid starts true, so submit is enabled before any field is touched.
    await expect(cta).toBeEnabled();
    await cta.click();
    // validateAll rejects the empty fields: no navigation, and the button disables.
    await expect(page).toHaveURL(/\/install\/2$/);
    await expect(cta).toBeDisabled();
  });

  test("step 2 shows a length error for a too-short connection name", async ({ page }) => {
    await gotoConnectStep(page);
    const name = page.getByPlaceholder("Name this connection");
    await name.fill("abcd");
    await name.blur();
    await expect(page.getByText("Must be at least 5 characters")).toBeVisible();
  });

  test("step 2 shows a required error for a blank ArgoCD token", async ({ page }) => {
    await gotoConnectStep(page);
    const token = page.getByLabel("ArgoCD API token");
    await token.click();
    await token.blur();
    await expect(page.getByText("This field is required")).toBeVisible();
  });
});
