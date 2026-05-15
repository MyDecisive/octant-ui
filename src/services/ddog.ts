import { createClient, createRouterTransport } from "@connectrpc/connect";
import { DatadogService } from "@mydecisiveai/octant-client";
import { transport } from "./transport";

const mockTransport = createRouterTransport(({ service }) => {
  service(DatadogService, {
    getDatadogIntegrations: (...args) => {
      console.log("DatadogService.getDatadogIntegrations", args);
      return { names: ["datadog-prod", "datadog-staging"] };
    },
    saveDatadogIntegration: (...args) => {
      console.log("DatadogService.saveDatadogIntegration", args);
      return {};
    },
  });
});

export const dDogServiceClient = createClient(
  DatadogService,
  import.meta.env.VITE_USE_MOCKS === "true" ? mockTransport : transport,
);
