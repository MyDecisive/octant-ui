import { createStore } from "zustand/vanilla";

import type { NormalizedApiError } from "../../../api/octant/errors";
import type {
  IntegrationRequest,
  ManifestDownload,
  ManifestRequest,
} from "../../../api/octant/types";
import {
  loadInstallManifest,
  submitInstallIntegration,
} from "../services/installService";

export type InstallStatus = "idle" | "loading" | "success" | "error";

export type InstallState = {
  status: InstallStatus;
  manifest?: ManifestDownload;
  integrationSaved: boolean;
  error?: NormalizedApiError;

  loadManifest: (request: ManifestRequest) => Promise<void>;
  submitIntegration: (request: IntegrationRequest) => Promise<void>;
  reset: () => void;
};

export function createInstallStore() {
  return createStore<InstallState>((set) => ({
    status: "idle",
    manifest: undefined,
    integrationSaved: false,
    error: undefined,

    loadManifest: async (request) => {
      set({ status: "loading", error: undefined });

      try {
        const manifest = await loadInstallManifest(request);
        set({ status: "success", manifest });
      } catch (error) {
        set({
          status: "error",
          error: error as NormalizedApiError,
        });
      }
    },

    submitIntegration: async (request) => {
      set({ status: "loading", error: undefined });

      try {
        await submitInstallIntegration(request);
        set({ status: "success", integrationSaved: true });
      } catch (error) {
        set({
          status: "error",
          error: error as NormalizedApiError,
        });
      }
    },

    reset: () => {
      set({
        status: "idle",
        manifest: undefined,
        integrationSaved: false,
        error: undefined,
      });
    },
  }));
}
