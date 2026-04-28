import { afterEach, describe, expect, it, vi } from "vitest";

import type { ManifestDownload } from "../../../api/octant/types";
import {
  loadInstallManifest,
  saveInstallConfiguration,
  submitInstallIntegration,
} from "./installService";

vi.mock("../../../api/octant/adapters/installApi", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../../api/octant/adapters/installApi")>();

  return {
    ...actual,
    createArgoIntegration: vi.fn(),
    createDatadogIntegration: vi.fn(),
    createIntegration: vi.fn(),
    fetchManifest: vi.fn(),
    saveConnectionManifest: vi.fn(),
  };
});

describe("installService", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads the install manifest through the adapter", async () => {
    const adapter = await import("../../../api/octant/adapters/installApi");
    const expected: ManifestDownload = {
      blob: new Blob(["manifest"]),
      filename: "manifest.yaml",
      contentType: "application/x-yaml",
    };
    vi.mocked(adapter.fetchManifest).mockResolvedValue(expected);

    await expect(loadInstallManifest({ connectionName: "dd" })).resolves.toBe(
      expected,
    );
  });

  it("submits an integration through the adapter", async () => {
    const adapter = await import("../../../api/octant/adapters/installApi");
    vi.mocked(adapter.createIntegration).mockResolvedValue(undefined);

    await submitInstallIntegration({
      name: "dd",
      apiKey: "api-key",
      url: "https://example.com",
    });

    expect(adapter.createIntegration).toHaveBeenCalledWith(
      expect.objectContaining({ name: "dd" }),
      expect.objectContaining({ signal: undefined }),
    );
  });

  it("persists Datadog, ArgoCD, and connection configuration", async () => {
    const adapter = await import("../../../api/octant/adapters/installApi");
    vi.mocked(adapter.createDatadogIntegration).mockResolvedValue(undefined);
    vi.mocked(adapter.createArgoIntegration).mockResolvedValue(undefined);
    vi.mocked(adapter.saveConnectionManifest).mockResolvedValue(undefined);

    await saveInstallConfiguration({
      connectionName: "dd",
      datadog: {
        apiKey: "api-key",
        url: "https://example.com",
      },
      argocd: {
        accountToken: "token",
        apiUrl: "https://argo.example.com",
      },
      manifest: {
        sourceType: "datadog",
        telemetryTypes: ["metrics"],
        destinations: [{ type: "datadog", integrationName: "dd" }],
        deployment: {
          type: "argocd-sideload",
          integrationName: "dd",
        },
      },
    });

    expect(adapter.createDatadogIntegration).toHaveBeenCalled();
    expect(adapter.createArgoIntegration).toHaveBeenCalled();
    expect(adapter.saveConnectionManifest).toHaveBeenCalledWith(
      "dd",
      expect.objectContaining({ sourceType: "datadog" }),
      expect.objectContaining({ signal: undefined }),
    );
  });
});
