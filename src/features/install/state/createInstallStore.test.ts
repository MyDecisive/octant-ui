import { afterEach, describe, expect, it, vi } from "vitest";

import { createInstallStore } from "./createInstallStore";

vi.mock("../services/installService", () => ({
  loadInstallManifest: vi.fn(),
  submitInstallIntegration: vi.fn(),
}));

describe("createInstallStore", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("handles successful manifest loads", async () => {
    const service = await import("../services/installService");
    const manifest = {
      blob: new Blob(["manifest"]),
      filename: "manifest.yaml",
      contentType: "application/x-yaml",
    };
    vi.mocked(service.loadInstallManifest).mockResolvedValue(manifest);
    const store = createInstallStore();

    await store.getState().loadManifest({ connectionName: "dd" });

    expect(store.getState()).toMatchObject({
      status: "success",
      manifest,
    });
  });

  it("handles failed manifest loads", async () => {
    const service = await import("../services/installService");
    vi.mocked(service.loadInstallManifest).mockRejectedValue({
      code: "VALIDATION_ERROR",
      message: "Connection is required",
      retryable: false,
    });
    const store = createInstallStore();

    await store.getState().loadManifest({ connectionName: "" });

    expect(store.getState()).toMatchObject({
      status: "error",
      error: {
        code: "VALIDATION_ERROR",
        message: "Connection is required",
      },
    });
  });

  it("handles successful integration submits", async () => {
    const service = await import("../services/installService");
    vi.mocked(service.submitInstallIntegration).mockResolvedValue(undefined);
    const store = createInstallStore();

    await store.getState().submitIntegration({
      name: "dd",
      apiKey: "api-key",
      url: "https://example.com",
    });

    expect(store.getState()).toMatchObject({
      status: "success",
      integrationSaved: true,
    });
  });

  it("preserves retryable backend errors", async () => {
    const service = await import("../services/installService");
    vi.mocked(service.loadInstallManifest).mockRejectedValue({
      code: "UPSTREAM_UNAVAILABLE",
      message: "Gateway unavailable",
      retryable: true,
    });
    const store = createInstallStore();

    await store.getState().loadManifest({ connectionName: "dd" });

    expect(store.getState().error).toMatchObject({
      code: "UPSTREAM_UNAVAILABLE",
      retryable: true,
    });
  });

  it("resets store state", async () => {
    const service = await import("../services/installService");
    vi.mocked(service.submitInstallIntegration).mockResolvedValue(undefined);
    const store = createInstallStore();

    await store.getState().submitIntegration({
      name: "dd",
      apiKey: "api-key",
      url: "https://example.com",
    });
    store.getState().reset();

    expect(store.getState()).toMatchObject({
      status: "idle",
      manifest: undefined,
      integrationSaved: false,
      error: undefined,
    });
  });
});
