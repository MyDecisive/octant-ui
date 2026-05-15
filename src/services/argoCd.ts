import { createClient, createRouterTransport } from "@connectrpc/connect";
import { ArgoCDService } from "@mydecisiveai/octant-client";
import { transport } from "./transport";

const mockTransport = createRouterTransport(({ service }) => {
  service(ArgoCDService, {
    testConnection: (...args) => {
      console.log("ArgoCDService.testConnection args ", args);
      return { success: true };
    },
    saveArgoConnection: (...args) => {
      console.log("ArgoCDService.saveArgoConnection ", args);
      return {};
    },
  });
});

export const argoCdServiceClient = createClient(
  ArgoCDService,
  import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS === "true"
    ? mockTransport
    : transport,
);
