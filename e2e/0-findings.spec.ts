import { test, expect } from "@playwright/test";
import { kubectl } from "./helpers/kubectl";

// Tests that assert the CORRECT behavior a known octant bug violates. Each is
// marked test.fail(): it documents the bug, keeps the suite green overall, and
// turns into a hard error (forcing this marker's removal) the moment octant is
// fixed. See the design doc's Findings.
test.describe("octant known issues (expected failures)", () => {
  test("GetConnections does not return 5xx on a fresh deploy", async ({ page }) => {
    test.fail(); // octant returns 500 when the connections ConfigMap is absent

    // Fresh-deploy state: no saved connection ConfigMap.
    kubectl(["delete", "configmap", "-n", "octant", "mdai-octant-connections", "--ignore-not-found"]);

    const serverErrors: string[] = [];
    page.on("response", (res) => {
      if (res.url().includes("ConnectionService/GetConnections") && res.status() >= 500) {
        serverErrors.push(`${res.status()} ${res.url()}`);
      }
    });

    await page.goto("/");
    // The app polls GetConnections on load; give it a couple of cycles.
    await page.waitForTimeout(6000);

    expect(serverErrors, "GetConnections should not return 5xx").toEqual([]);
  });
});
