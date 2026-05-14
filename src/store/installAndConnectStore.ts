import type { TelemetryTypes } from "@types";
import { create } from "zustand";

interface AppStateForm {
  argoAgreement: boolean;
  namespace: string;
  argoUrl?: string;
  accountToken?: string;
  telemetryTypes: TelemetryTypes[];
  url?: string;
  apiKey?: string;
  connectionName?: string;
  mdaiVersion?: string;
}
interface Actions {
  setFormField: (
    key: keyof AppStateForm,
    value: AppStateForm[keyof AppStateForm],
  ) => void;
  resetForm: () => void;
}

type InstallAndConnectStore = AppStateForm & Actions;

function createDefaultConnectForm(): AppStateForm {
  return {
    argoAgreement: false,
    namespace: "mdai",
    telemetryTypes: [],
    mdaiVersion: "0.10.0",
  };
}

export const useInstallAndConnectStore = create<InstallAndConnectStore>()(
  (set) => ({
    ...createDefaultConnectForm(),
    setFormField: (key, value) => set((state) => ({ ...state, [key]: value })),
    resetForm: () => set(() => createDefaultConnectForm()),
  }),
);
