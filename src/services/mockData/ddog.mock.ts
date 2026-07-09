import type { MessageInitShape } from "@bufbuild/protobuf";
import { createRouterTransport } from "@connectrpc/connect";
import {
  DatadogService,
  GetDatadogIntegrationByNameResponseSchema,
} from "@mydecisiveai/octant-client";

type MockDDogIntegration = MessageInitShape<
  typeof GetDatadogIntegrationByNameResponseSchema
>;

const integrations = new Map<string, MockDDogIntegration>([
  [
    "datadog-prod",
    {
      url: "us5.datadoghq.com",
    },
  ],
  [
    "datadog-staging",
    {
      url: "localhost: 9090",
    },
  ],
]);

export const mockTransport = createRouterTransport(({ service }) => {
  service(DatadogService, {
    getDatadogIntegrations: (...args) => {
      console.log("DatadogService.getDatadogIntegrations", args);

      return { names: Array.from(integrations.keys()) };
    },
    getDatadogIntegrationByName: (request) => {
      console.log("DatadogService.getDatadogIntegrations", request);
      const integration = integrations.get(request.name);
      if (integration) {
        return integration;
      }
      return {};
    },
    saveDatadogIntegration: (request) => {
      console.log("DatadogService.saveDatadogIntegration", request);
      if (request.name) {
        integrations.set(request.name, { url: request.siteHost });
      }
      return {};
    },
  });
});
