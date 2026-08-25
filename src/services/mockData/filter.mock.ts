import { createRouterTransport } from "@connectrpc/connect";
import {
  FilterService,
  FilterType,
  MLTType,
  UpdateFilterResponse_Status,
} from "@mydecisiveai/octant-client";
import { delay } from "@utils/delay";
import { getMockConnectionTelemetryTypes } from "./connection.mock";

function filterTypeIsConfigured(connectionName: string, type: FilterType) {
  const telemetryTypes = getMockConnectionTelemetryTypes(connectionName);

  switch (type) {
    case FilterType.LOG:
      return telemetryTypes.includes(MLTType.MLT_TYPE_LOG);
    case FilterType.TRACE:
      return telemetryTypes.includes(MLTType.MLT_TYPE_TRACE);
    default:
      return false;
  }
}

export const mockTransport = createRouterTransport(({ service }) => {
  service(FilterService, {
    getFilter: ({ connectionName, type }, ...args) => {
      console.log("FilterService.getFilter ", [
        { connectionName, type },
        ...args,
      ]);

      if (!filterTypeIsConfigured(connectionName, type)) {
        return {};
      }

      return {
        data: {
          type,
          pctSampled: type === FilterType.LOG ? 25 : 10,
          includeErr: type === FilterType.TRACE,
        },
      };
    },
    updateFilter: async function* (...args) {
      console.log("FilterService.updateFilter ", args);
      await delay(1000);
      yield { status: UpdateFilterResponse_Status.VALUE_UPDATED };
      await delay(1000);
      yield { status: UpdateFilterResponse_Status.WAIT_PROPAGATION };
      await delay(1000);
      yield { status: UpdateFilterResponse_Status.COMPLETED };
    },
  });
});
