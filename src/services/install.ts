import { createClient, createRouterTransport } from "@connectrpc/connect";
import {
  InstallService,
  InstallStatus,
  type GetInstallStatusResponse,
} from "@mydecisiveai/octant-client";
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

type InstallStatusResult =
  | { status: "installed" }
  | { status: "timeout"; lastResponse?: GetInstallStatusResponse }
  | {
      status: "error";
      lastResponse?: GetInstallStatusResponse;
      error?: unknown;
    };

export async function waitForInstallStatus(
  connectionName: string,
): Promise<InstallStatusResult> {
  let lastResponse: GetInstallStatusResponse | undefined;

  try {
    for await (const res of installServiceClient.getInstallStatus({
      connectionName,
    })) {
      switch (res.installStatus) {
        case InstallStatus.INSTALLED:
          return { status: "installed" };
        case InstallStatus.TIMEOUT:
          return { status: "timeout", lastResponse };
        default:
          lastResponse = res;
          continue;
      }
    }

    return { status: "error", lastResponse };
  } catch (e) {
    return { status: "error", lastResponse, error: e };
  }
}
