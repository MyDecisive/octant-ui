import { afterEach, describe, expect, it, vi } from "vitest";

import { octantClient } from "../client";
import {
  DeploymentType,
  ManifestOutFormat,
  MLTType,
  createIntegration,
  fetchManifest,
} from "./installApi";

describe("installApi", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads a manifest successfully", async () => {
    const requestSpy = vi
      .spyOn(octantClient, "request")
      .mockResolvedValue(
        new Response("manifest", {
          status: 200,
          headers: {
            "Content-Disposition": 'attachment; filename="octant.yaml"',
            "Content-Type": "application/x-yaml",
          },
        }),
      );

    const manifest = await fetchManifest({
      namespace: "mdai",
      connectionName: "datadog-one",
      format: ManifestOutFormat.YAML,
      deploymentType: DeploymentType.ARGO_SIDELOAD,
      telemetryTypes: [MLTType.MLT_TYPE_LOG],
    });

    expect(manifest.filename).toBe("octant.yaml");
    expect(await manifest.blob.text()).toBe("manifest");
    const [path, options] = requestSpy.mock.calls[0] as [
      string,
      { method: string; body: unknown },
    ];
    expect(path).toBe("/connections/datadog-one/manifests/yaml");
    expect(options.method).toBe("POST");
    expect(options.body).toMatchObject({
      sourceType: "datadog",
      telemetryTypes: ["logs"],
    });
  });

  it("normalizes failed manifest loads", async () => {
    vi.spyOn(octantClient, "request").mockRejectedValue({
      status: 422,
      message: "Invalid connection",
      fieldErrors: {
        connectionName: "Required",
      },
    });

    await expect(
      fetchManifest({
        namespace: "mdai",
        connectionName: "",
        format: ManifestOutFormat.YAML,
        deploymentType: DeploymentType.ARGO_SIDELOAD,
        telemetryTypes: [],
      }),
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      message: "Invalid connection",
      retryable: false,
      fieldErrors: {
        connectionName: "Required",
      },
    });
  });

  it("submits an integration successfully", async () => {
    const putSpy = vi.spyOn(octantClient, "put").mockResolvedValue(undefined);

    await createIntegration({
      name: "datadog-one",
      apiKey: "api-key",
      url: "https://example.datadoghq.com",
    });

    expect(putSpy).toHaveBeenCalledWith(
      "/integrations/datadog/datadog-one",
      expect.objectContaining({
        body: {
          apiKey: "api-key",
          url: "https://example.datadoghq.com",
        },
      }),
    );
  });

  it("marks retryable backend failures", async () => {
    vi.spyOn(octantClient, "request").mockRejectedValue({
      status: 503,
      message: "Gateway unavailable",
    });

    await expect(
      fetchManifest({
        namespace: "mdai",
        connectionName: "datadog-one",
        format: ManifestOutFormat.YAML,
        deploymentType: DeploymentType.ARGO_SIDELOAD,
        telemetryTypes: [],
      }),
    ).rejects.toMatchObject({
      code: "UPSTREAM_UNAVAILABLE",
      retryable: true,
    });
  });
});
