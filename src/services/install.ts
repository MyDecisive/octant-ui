import { createClient, createRouterTransport } from "@connectrpc/connect";
import { InstallService, InstallStatus } from "@mydecisiveai/octant-client";
import { transport } from "./transport";

const mockTransport = createRouterTransport(({ service }) => {
  service(InstallService, {
    installMDAIHub: (...args) => {
      console.log("InstallService.installMDAIHub ", args);
      return {};
    },
    getInstallStatus: async function* (...args) {
      console.log("InstallService.getInstallStatus", args);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      yield { installStatus: InstallStatus.INSTALLING, details: [] };
      await new Promise((resolve) => setTimeout(resolve, 1000));
      yield { installStatus: InstallStatus.INSTALLING, details: [] };
      await new Promise((resolve) => setTimeout(resolve, 1000));
      yield { installStatus: InstallStatus.INSTALLED, details: [] };
    },
  });
});

export const installServiceClient = createClient(
  InstallService,
  import.meta.env.VITE_USE_MOCKS === "true" ? mockTransport : transport,
);
