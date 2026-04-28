import {
  type GenerateManifestsResponse,
  type GetConnectionStatusResponse,
  type GetDatadogIntegrationsResponse,
  type GetInstallStatusResponse,
  type TestConnectionResponse,
} from "@mydecisiveai/octant-client";
import {
  DeploymentType,
  ManifestOutFormat,
  MLTType,
} from "@mydecisiveai/octant-client/dist/octant/v1alpha/type_pb";

import { octantClient } from "../client";
import { normalizeApiError } from "../errors";
import type {
  ArgoConnectionTestRequest,
  InstallHubRequest,
  InstallStatusRequest,
  ManifestDownload,
  ManifestRequest,
  OctantRequestMeta,
  TelemetryRequest,
} from "../types";
import type { IntegrationRequest } from "../types";

type DeploymentPayload = {
  type: "argocd-sideload" | "argocd-manifests";
  integrationName: string;
};

type ManifestPayload = {
  sourceType: "datadog";
  telemetryTypes: Array<"logs" | "metrics" | "traces">;
  deployment: DeploymentPayload;
  destinations: Array<{
    type: "datadog";
    integrationName: string;
  }>;
};

type DatadogIntegrationRequest = {
  name?: string;
  apiKey?: string;
  url?: string;
};

type ArgoIntegrationRequest = {
  name?: string;
  argoEndpoint?: string;
  argoAccountToken?: string;
};

const defaultJsonHeaders = {
  Accept: "application/json",
};

function toTelemetryType(type: MLTType): "logs" | "metrics" | "traces" {
  if (type === MLTType.MLT_TYPE_LOG) return "logs";
  if (type === MLTType.MLT_TYPE_TRACE) return "traces";

  return "metrics";
}

function toDeploymentType(type: DeploymentType): DeploymentPayload["type"] {
  return type === DeploymentType.ARGO_MANIFEST
    ? "argocd-manifests"
    : "argocd-sideload";
}

function toManifestPayload(input: ManifestRequest): ManifestPayload {
  const connectionName = input.connectionName ?? "";

  return {
    sourceType: "datadog",
    telemetryTypes: input.telemetryTypes?.map(toTelemetryType) ?? [],
    destinations: [
      {
        type: "datadog",
        integrationName: connectionName,
      },
    ],
    deployment: {
      type: toDeploymentType(
        input.deploymentType ?? DeploymentType.ARGO_SIDELOAD,
      ),
      integrationName: connectionName,
    },
  };
}

function getFilename(response: Response, fallbackName: string) {
  const disposition = response.headers.get("Content-Disposition");

  return (
    disposition?.match(/filename="?([^"]+)"?/)?.[1] ??
    `${fallbackName}-manifests.yaml`
  );
}

export async function fetchManifest(
  input: ManifestRequest,
  meta: OctantRequestMeta = {},
): Promise<ManifestDownload> {
  const connectionName = input.connectionName ?? "";

  try {
    const response = await octantClient.request(
      `/connections/${connectionName}/manifests/${
        input.format === ManifestOutFormat.JSON ? "json" : "yaml"
      }`,
      {
        method: "POST",
        body: toManifestPayload(input),
        headers: defaultJsonHeaders,
        ...meta,
      },
    );
    const blob = await response.blob();

    return {
      blob,
      filename: getFilename(response, connectionName),
      contentType:
        response.headers.get("Content-Type") ??
        (input.format === ManifestOutFormat.JSON
          ? "application/json"
          : "application/x-yaml"),
    };
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function generateManifests(
  input: ManifestRequest,
  meta: OctantRequestMeta = {},
): Promise<GenerateManifestsResponse> {
  const manifest = await fetchManifest(input, meta);

  return {
    $typeName: "octant.v1alpha.GenerateManifestsResponse",
    data: new Uint8Array(await manifest.blob.arrayBuffer()),
    total: BigInt(manifest.blob.size),
    type: manifest.contentType,
  };
}

export async function getConnectionStatus(
  input: TelemetryRequest,
  meta: OctantRequestMeta = {},
): Promise<GetConnectionStatusResponse> {
  try {
    return await octantClient.get<GetConnectionStatusResponse>(
      `/connections/${input.connectionName ?? ""}/status`,
      {
        headers: defaultJsonHeaders,
        ...meta,
      },
    );
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function getDatadogIntegrations(
  meta: OctantRequestMeta = {},
): Promise<GetDatadogIntegrationsResponse> {
  try {
    const integrations = await octantClient.get<Array<{ name: string }>>(
      "/integrations/datadog",
      {
        headers: defaultJsonHeaders,
        ...meta,
      },
    );

    return {
      $typeName: "octant.v1alpha.GetDatadogIntegrationsResponse",
      names: integrations.map((integration) => integration.name),
    };
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function createDatadogIntegration(
  input: DatadogIntegrationRequest,
  meta: OctantRequestMeta = {},
): Promise<void> {
  try {
    await octantClient.put(`/integrations/datadog/${input.name ?? ""}`, {
      body: {
        apiKey: input.apiKey,
        url: input.url,
      },
      headers: defaultJsonHeaders,
      ...meta,
    });
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function createArgoIntegration(
  input: ArgoIntegrationRequest,
  meta: OctantRequestMeta = {},
): Promise<void> {
  try {
    await octantClient.put(`/integrations/argocd/${input.name ?? ""}`, {
      body: {
        accountToken: input.argoAccountToken,
        apiUrl: input.argoEndpoint,
      },
      headers: defaultJsonHeaders,
      ...meta,
    });
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function createIntegration(
  input: IntegrationRequest,
  meta: OctantRequestMeta = {},
): Promise<void> {
  if ("apiKey" in input) {
    return createDatadogIntegration(input, meta);
  }

  return createArgoIntegration(input, meta);
}

export async function testArgoConnection(
  input: ArgoConnectionTestRequest,
  meta: OctantRequestMeta = {},
): Promise<TestConnectionResponse> {
  try {
    return await octantClient.post<TestConnectionResponse>("/argocd/test", {
      body: {
        apiUrl: input.argoEndpoint,
        accountToken: input.argoAccountToken,
      },
      headers: defaultJsonHeaders,
      ...meta,
    });
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function saveConnectionManifest(
  connectionName: string,
  body: ManifestPayload,
  meta: OctantRequestMeta = {},
): Promise<void> {
  try {
    await octantClient.put(`/connections/${connectionName}`, {
      body,
      headers: defaultJsonHeaders,
      ...meta,
    });
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function installMDAIHub(
  input: InstallHubRequest,
  meta: OctantRequestMeta = {},
): Promise<void> {
  try {
    await octantClient.post("/install/mdaihub", {
      body: input,
      headers: defaultJsonHeaders,
      ...meta,
    });
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function getInstallStatus(
  input: InstallStatusRequest,
  meta: OctantRequestMeta = {},
): Promise<GetInstallStatusResponse> {
  try {
    return await octantClient.get<GetInstallStatusResponse>(
      `/install/mdaihub/${input.hubName ?? ""}/status`,
      {
        headers: defaultJsonHeaders,
        ...meta,
      },
    );
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export { DeploymentType, ManifestOutFormat, MLTType };
