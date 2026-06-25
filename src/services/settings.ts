import type { TelemetryTypes } from "@app-types/enums";
import { createClient, createRouterTransport } from "@connectrpc/connect";
import {
  SettingService,
  UpdateResponse_Status,
} from "@mydecisiveai/octant-client";
import { toMLTTypes } from "@utils/toMltTypes";
import { setMockConnectionTelemetryTypes } from "./mockData/connection.mock";
import { transport } from "./transport";

export interface UpdateCollectorSettingsParams {
  connectionName: string;
  namespace: string;
  telemetryTypes: TelemetryTypes[];
  datadogUrl: string;
  datadogApiKey: string;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mockTransport = createRouterTransport(({ service }) => {
  service(SettingService, {
    update: async function* (request) {
      console.log("SettingService.update", request);
      await delay(800);
      yield { status: UpdateResponse_Status.UPDATED };
      await delay(800);
      yield { status: UpdateResponse_Status.DEPLOY };
      await delay(800);
      if (request.scope?.connectionName) {
        setMockConnectionTelemetryTypes({
          connectionName: request.scope.connectionName,
          namespace: request.scope.namespace,
          telemetryTypes: request.telemetryTypes,
        });
      }
      yield { status: UpdateResponse_Status.COMPLETED };
    },
  });
});

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
