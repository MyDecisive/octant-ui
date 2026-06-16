import type { AsyncStatus } from "@types";
import { createInFlightRequestCache } from "@utils/createInFlightRequestCache";
import { create } from "zustand";
import { ASYNC_STATUS } from "../constants/status";
import { waitForInstallStatus } from "../services/install";

interface HubInstallState {
  installed?: boolean;
  status: AsyncStatus;
  error?: string;
  setInstalled: (installed: boolean) => void;
  verifyInstall: (connectionName: string) => Promise<boolean>;
}

const installVerifications = createInFlightRequestCache<boolean>();

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong while verifying Smarthub installation.";
}

export const useHubInstallStore = create<HubInstallState>()((set) => ({
  status: ASYNC_STATUS.IDLE,
  setInstalled: (installed) =>
    set({ installed, status: ASYNC_STATUS.SUCCESS }),
  verifyInstall: async (connectionName) => {
    return installVerifications.run(connectionName, async () => {
      set({ status: ASYNC_STATUS.LOADING, error: undefined });

      try {
        const installResult = await waitForInstallStatus(connectionName);
        const installed = installResult.status === "installed";

        set({ installed, status: ASYNC_STATUS.SUCCESS, error: undefined });
        return installed;
      } catch (error) {
        set({
          status: ASYNC_STATUS.ERROR,
          error: getErrorMessage(error),
        });
        return false;
      }
    });
  },
}));
