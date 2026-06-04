import { create } from "zustand";
import {
  updateCollectorSettings,
  type UpdateCollectorSettingsParams,
} from "../services/settings";

type SettingsStatus = "idle" | "loading" | "success" | "error";

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
  status: "idle",
  loadingDismissed: false,
  updateSettings: async (payload) => {
    set({ status: "loading", error: undefined, loadingDismissed: false });

    try {
      const updated = await updateCollectorSettings(payload);

      if (!updated) {
        set({
          status: "error",
          error: "Octant timed out while updating collector settings.",
          loadingDismissed: false,
        });
        return false;
      }

      set({ status: "success", error: undefined, loadingDismissed: false });
      return true;
    } catch (e) {
      set({
        status: "error",
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
    set({ status: "error", error, loadingDismissed: false }),
  dismiss: () =>
    set((state) =>
      state.status === "loading"
        ? { loadingDismissed: true }
        : { status: "idle", error: undefined, loadingDismissed: false },
    ),
}));
