import {
  DeploymentType,
  ManifestOutFormat,
  MLTType,
  createArgoIntegration,
  createDatadogIntegration,
  createIntegration,
  fetchManifest,
  saveConnectionManifest,
  testArgoConnection,
} from "../../../api/octant/adapters/installApi";
import type {
  ArgoConnectionTestRequest,
  IntegrationRequest,
  ManifestDownload,
  ManifestRequest,
} from "../../../api/octant/types";
import type { DeployMethod, ManifestPayload, TelemetryTypes } from "@types";

export type InstallConfigurationRequest = {
  connectionName: string;
  datadog: {
    apiKey: string;
    url: string;
  };
  argocd: {
    accountToken: string;
    apiUrl: string;
  };
  manifest: ManifestPayload;
};

function toMltType(type: TelemetryTypes): MLTType {
  if (type === "logs") return MLTType.MLT_TYPE_LOG;
  if (type === "traces") return MLTType.MLT_TYPE_TRACE;

  return MLTType.MLT_TYPE_METRIC;
}

function toDeploymentType(type: DeployMethod): DeploymentType {
  return type === "argocd-manifests"
    ? DeploymentType.ARGO_MANIFEST
    : DeploymentType.ARGO_SIDELOAD;
}

export function createManifestRequest(input: {
  namespace: string;
  connectionName: string;
  telemetryTypes: TelemetryTypes[];
  deployMethod: DeployMethod;
}): ManifestRequest {
  return {
    namespace: input.namespace,
    connectionName: input.connectionName,
    format: ManifestOutFormat.YAML,
    deploymentType: toDeploymentType(input.deployMethod),
    telemetryTypes: input.telemetryTypes.map(toMltType),
  };
}

export async function loadInstallManifest(
  request: ManifestRequest,
  signal?: AbortSignal,
): Promise<ManifestDownload> {
  return fetchManifest(request, { signal });
}

export async function submitInstallIntegration(
  request: IntegrationRequest,
  signal?: AbortSignal,
): Promise<void> {
  return createIntegration(request, { signal });
}

export async function testInstallClusterConnection(
  request: ArgoConnectionTestRequest,
  signal?: AbortSignal,
) {
  return testArgoConnection(request, { signal });
}

export async function saveInstallConfiguration(
  request: InstallConfigurationRequest,
  signal?: AbortSignal,
): Promise<void> {
  await Promise.all([
    createDatadogIntegration(
      {
        name: request.connectionName,
        apiKey: request.datadog.apiKey,
        url: request.datadog.url,
      },
      { signal },
    ),
    createArgoIntegration(
      {
        name: request.connectionName,
        argoAccountToken: request.argocd.accountToken,
        argoEndpoint: request.argocd.apiUrl,
      },
      { signal },
    ),
  ]);

  await saveConnectionManifest(request.connectionName, request.manifest, {
    signal,
  });
}
