import type { MessageInitShape } from "@bufbuild/protobuf";
import { createRouterTransport } from "@connectrpc/connect";
import {
  ArgoCDService,
  GetArgoIntegrationByNameResponseSchema,
} from "@mydecisiveai/octant-client";

type MockArgoCdIntegration = MessageInitShape<
  typeof GetArgoIntegrationByNameResponseSchema
>;

const integrations = new Map<string, MockArgoCdIntegration>([
  [
    "datadog-prod",
    {
      argoEndpoint: "argo-cd-argocd-server.argocd.svc.cluster.local:8080",
    },
  ],
  [
    "datadog-staging",
    {
      argoEndpoint: "localhost:8080",
    },
  ],
]);

export const mockTransport = createRouterTransport(({ service }) => {
  service(ArgoCDService, {
    testConnection: (...args) => {
      console.log("ArgoCDService.testConnection args ", args);
      return { success: true };
    },
    saveArgoConnection: (...args) => {
      console.log("ArgoCDService.saveArgoConnection ", args);
      return {};
    },
    getArgoIntegrations: (...args) => {
      console.log("ArgoCDService.saveArgoConnection ", args);
      return { names: Array.from(integrations.keys()) };
    },
    getArgoIntegrationByName: (request) => {
      console.log("ArgoCDService.getArgoIntegrationByName", request);
      const integration = integrations.get(request.name);
      if (integration) {
        return integration;
      }
      return {};
    },
  });
});
