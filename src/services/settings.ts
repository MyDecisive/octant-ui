import type { UpdateCollectorSettingsParams } from "@app-types/contracts";
import { createClient } from "@connectrpc/connect";
import {
  SettingService,
  UpdateResponse_Status,
} from "@mydecisiveai/octant-client";
import { toMLTTypes } from "@utils/toMLTTypes";
import { mockTransport } from "./mockData/settings.mock";
import { transport } from "./transport";

export const settingServiceClient = createClient(
  SettingService,
  import.meta.env.VITE_USE_MOCKS === "true" ? mockTransport : transport,
);

export async function updateCollectorSettings({
  connectionName,
  namespace,
  telemetryTypes,
  datadogUrl,
  datadogApiKey,
}: UpdateCollectorSettingsParams) {
  for await (const response of settingServiceClient.update({
    scope: {
      connectionName,
      namespace,
    },
    telemetryTypes: toMLTTypes(telemetryTypes),
    datadogUrl,
    datadogApiKey,
  })) {
    if (response.status === UpdateResponse_Status.COMPLETED) {
      return true;
    }

    if (response.status === UpdateResponse_Status.TIMEOUT) {
      return false;
    }
  }

  return false;
}
