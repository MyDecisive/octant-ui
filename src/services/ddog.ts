import { createClient, createRouterTransport } from "@connectrpc/connect";
import { DatadogService } from "@mydecisiveai/octant-client";
import { transport } from "./transport";

const mockDatadogIntegrationNames = new Set([
  "datadog-prod",
  "datadog-staging",
]);

const mockTransport = createRouterTransport(({ service }) => {
  service(DatadogService, {
    getDatadogIntegrations: (...args) => {
      console.log("DatadogService.getDatadogIntegrations", args);
      return { names: Array.from(mockDatadogIntegrationNames) };
    },
    saveDatadogIntegration: (request) => {
      console.log("DatadogService.saveDatadogIntegration", request);
      if (request.name) {
        mockDatadogIntegrationNames.add(request.name);
      }
      return {};
    },
  });
});

export const dDogServiceClient = createClient(
  DatadogService,
  import.meta.env.VITE_USE_MOCKS === "true" ? mockTransport : transport,
);
