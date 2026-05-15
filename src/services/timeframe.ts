import { createClient, createRouterTransport } from "@connectrpc/connect";
import {
  Timeframe,
  TimeframeService,
  TimeframeStatusResponse_Code,
} from "@mydecisiveai/octant-client";
import { transport } from "./transport";

const mockTransport = createRouterTransport(({ service }) => {
  service(TimeframeService, {
    timeframeStatus: (...args) => {
      console.log("TimeframeService.timeframeStatus ", args);
      return {
        statuses: [
          {
            timeframe: Timeframe.TIMEFRAME_24HR,
            status: TimeframeStatusResponse_Code.OK,
          },
          {
            timeframe: Timeframe.TIMEFRAME_MTD,
            status: TimeframeStatusResponse_Code.OK,
          },
          {
            timeframe: Timeframe.TIMEFRAME_LM,
            status: TimeframeStatusResponse_Code.NOT_ENOUGH,
          },
        ],
        trace: true,
        log: true,
      };
    },
  });
});

export const timeframeServiceClient = createClient(
  TimeframeService,
  import.meta.env.VITE_USE_MOCKS === "true" ? mockTransport : transport,
);
