import { createClient, createRouterTransport } from "@connectrpc/connect";
import {
  FilterService,
  FilterType,
  UpdateFilterResponse_Status,
} from "@mydecisiveai/octant-client";
import { transport } from "./transport";

const mockTransport = createRouterTransport(({ service }) => {
  service(FilterService, {
    getFilter: ({ type }, ...args) => {
      console.log("FilterService.getFilter ", [{ type }, ...args]);
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      yield { status: UpdateFilterResponse_Status.VALUE_UPDATED };
      await new Promise((resolve) => setTimeout(resolve, 1000));
      yield { status: UpdateFilterResponse_Status.WAIT_PROPAGATION };
      await new Promise((resolve) => setTimeout(resolve, 1000));
      yield { status: UpdateFilterResponse_Status.COMPLETED };
    },
  });
});

export const filterServiceClient = createClient(
  FilterService,
  import.meta.env.VITE_USE_MOCKS === "true" ? mockTransport : transport,
);
