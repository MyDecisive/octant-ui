import type { TelemetryTypes } from "@types";
import { useContext } from "react";
import { createStore, useStore } from "zustand";
import { InstallAndConnectContext } from "../contexts/InstallAndConnect";

export interface InstallAndConnectFormFields {
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

export interface InstallAndConnectFormState extends InstallAndConnectFormFields {
  setFormField: (
    key: keyof InstallAndConnectFormFields,
    value: InstallAndConnectFormFields[keyof InstallAndConnectFormFields],
  ) => void;
  resetForm: () => void;
}

export type InstallAndConnectStore = ReturnType<
  typeof createInstallAndConnectStore
>;

function createDefaultConnectForm(): InstallAndConnectFormFields {
  return {
    argoAgreement: false,
    namespace: "mdai",
    telemetryTypes: [],
    mdaiVersion: "0.10.0",
  };
}

export const createInstallAndConnectStore = (
  initProps?: Partial<InstallAndConnectFormFields>,
) => {
  const defaultForm = createDefaultConnectForm();

  return createStore<InstallAndConnectFormState>()((set) => ({
    ...defaultForm,
    ...initProps,
    setFormField: (key, value) => set((state) => ({ ...state, [key]: value })),
    resetForm: () => set(() => createDefaultConnectForm()),
  }));
};

export function useInstallAndConnectStore<T>(
  selector: (state: InstallAndConnectFormState) => T,
): T {
  const store = useContext(InstallAndConnectContext);
  if (!store)
    throw new Error("Missing InstallAndConnectContext Provider in the tree");
  return useStore(store, selector);
}
