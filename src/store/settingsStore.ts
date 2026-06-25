import type { AsyncStatus } from "@app-types/enums";
import { ASYNC_STATUS } from "@constants/enums";
import { create } from "zustand";
import {
  updateCollectorSettings,
  type UpdateCollectorSettingsParams,
} from "../services/settings";

export type SettingsStatus = AsyncStatus;

interface SettingsState {
  status: SettingsStatus;
  error?: string;
  loadingDismissed: boolean;
}

interface SettingsActions {
  updateSettings: (payload: UpdateCollectorSettingsParams) => Promise<boolean>;
  showError: (error: string) => void;
  dismiss: () => void;
}

type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()((set) => ({
  status: ASYNC_STATUS.IDLE,
  loadingDismissed: false,
  updateSettings: async (payload) => {
    set({
      status: ASYNC_STATUS.LOADING,
      error: undefined,
      loadingDismissed: false,
    });

    try {
      const updated = await updateCollectorSettings(payload);

      if (!updated) {
        set({
          status: ASYNC_STATUS.ERROR,
          error: "Octant timed out while updating collector settings.",
          loadingDismissed: false,
        });
        return false;
      }

      set({
        status: ASYNC_STATUS.SUCCESS,
        error: undefined,
        loadingDismissed: false,
      });
      return true;
    } catch (e) {
      set({
        status: ASYNC_STATUS.ERROR,
        error:
          e instanceof Error
            ? e.message
            : "Something went wrong while updating collector settings.",
        loadingDismissed: false,
      });
      return false;
    }
  },
  showError: (error) =>
    set({ status: ASYNC_STATUS.ERROR, error, loadingDismissed: false }),
  dismiss: () =>
    set((state) =>
      state.status === ASYNC_STATUS.LOADING
        ? { loadingDismissed: true }
        : {
            status: ASYNC_STATUS.IDLE,
            error: undefined,
            loadingDismissed: false,
          },
    ),
}));
