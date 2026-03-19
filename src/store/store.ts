import type { TelemetryTypes, ViewKey } from "@types";
import { create } from "zustand";

interface AppStateForm {
  deployMethod: "argo";
  branch?: string;
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
    deployMethod: "argo",
    telemetryTypes: [],
  };
}

function createDefaultOctantConnectState() {
  return {
    activeView: "splash",
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
