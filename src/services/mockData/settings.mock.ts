import { createRouterTransport } from "@connectrpc/connect";
import {
  SettingService,
  UpdateResponse_Status,
} from "@mydecisiveai/octant-client";
import { setMockConnectionTelemetryTypes } from "./connection.mock";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockTransport = createRouterTransport(({ service }) => {
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
