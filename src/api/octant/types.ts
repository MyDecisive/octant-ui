import type { MessageInitShape } from "@bufbuild/protobuf";
import type {
  GenerateManifestsRequestSchema,
  GenerateManifestsResponse,
  GetConnectionStatusRequestSchema,
  GetConnectionStatusResponse,
  GetDatadogIntegrationsResponse,
  GetInstallStatusRequestSchema,
  GetInstallStatusResponse,
  InstallMDAIHubRequestSchema,
  SaveArgoConnectionRequestSchema,
  SaveDatadogIntegrationRequestSchema,
  TestConnectionRequestSchema,
  TestConnectionResponse,
} from "@mydecisiveai/octant-client";

export type OctantRequestMeta = {
  requestId?: string;
  correlationId?: string;
  signal?: AbortSignal;
};

export type ApiSuccess<T> = {
  ok: true;
  data: T;
  requestId?: string;
};

export type ApiFailure = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    retryable?: boolean;
    fieldErrors?: Record<string, string>;
  };
  requestId?: string;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export type ManifestRequest = MessageInitShape<
  typeof GenerateManifestsRequestSchema
>;
export type ManifestResponse = GenerateManifestsResponse;
export type IntegrationRequest =
  | MessageInitShape<typeof SaveDatadogIntegrationRequestSchema>
  | MessageInitShape<typeof SaveArgoConnectionRequestSchema>;
export type IntegrationResponse = void;
export type TelemetryRequest = MessageInitShape<
  typeof GetConnectionStatusRequestSchema
>;
export type TelemetryResponse = GetConnectionStatusResponse;
export type ArgoConnectionTestRequest = MessageInitShape<
  typeof TestConnectionRequestSchema
>;
export type ArgoConnectionTestResponse = TestConnectionResponse;
export type DatadogIntegrationsResponse = GetDatadogIntegrationsResponse;
export type InstallHubRequest = MessageInitShape<
  typeof InstallMDAIHubRequestSchema
>;
export type InstallStatusRequest = MessageInitShape<
  typeof GetInstallStatusRequestSchema
>;
export type InstallStatusResponse = GetInstallStatusResponse;

export type ManifestDownload = {
  blob: Blob;
  filename: string;
  contentType: string;
};
