import type { DeployMethod, TelemetryTypes, ViewKey } from "@types";
import { create } from "zustand";

export interface AppStateForm {
  argoAgreement: boolean;
  deployMethod: DeployMethod;
  argoUrl?: string;
  accountToken?: string;
  telemetryTypes: TelemetryTypes[];
  url?: string;
  apiKey?: string;
  connectionName?: string;
}
interface Values {
  activeView: ViewKey;
  form: AppStateForm;
}

interface Actions {
  setActiveView: (newView: ViewKey) => void;
  setFormField: (
    key: keyof AppStateForm,
    value: AppStateForm[keyof AppStateForm],
  ) => void;
  resetForm: () => void;
}

type OctantConnectStore = Values & Actions;

function createDefaultOctantConnectForm(): AppStateForm {
  return {
    argoAgreement: false,
    deployMethod: "argocd-sideload",
    telemetryTypes: [],
  };
}

function createDefaultOctantConnectState() {
  return {
    activeView: "argoInstall",
    form: createDefaultOctantConnectForm(),
  };
}

export const useOctantConnectStore = create<OctantConnectStore>()((set) => ({
  ...createDefaultOctantConnectState(),
  setActiveView: (newView) =>
    set((state) => ({ ...state, activeView: newView })),
  setFormField: (key, value) =>
    set((state) => ({ ...state, form: { ...state.form, [key]: value } })),
  resetForm: () =>
    set((state) => ({ ...state, form: createDefaultOctantConnectForm() })),
}));
