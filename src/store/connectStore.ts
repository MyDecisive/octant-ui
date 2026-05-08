import type { TelemetryTypes, ViewKey } from "@types";
import { create } from "zustand";
import { VIEW_ORDER } from "../flows/install";

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
  advanceInstallFlow: () => void;
}

type OctantConnectStore = Values & Actions;

function createDefaultConnectForm(): AppStateForm {
  return {
    argoAgreement: false,
    namespace: "mdai",
    telemetryTypes: [],
    mdaiVersion: "0.10.0",
  };
}

function createDefaultConnectState() {
  return {
    activeView: "argoInstall",
    form: createDefaultConnectForm(),
  };
}

export const useConnectStore = create<OctantConnectStore>()((set) => ({
  ...createDefaultConnectState(),
  setActiveView: (newView) =>
    set((state) => ({ ...state, activeView: newView })),
  setFormField: (key, value) =>
    set((state) => ({ ...state, form: { ...state.form, [key]: value } })),
  resetForm: () =>
    set((state) => ({ ...state, form: createDefaultConnectForm() })),
  advanceInstallFlow: () => {
    set((state) => {
      const currentView = state.activeView;
      const currentViewIdx = VIEW_ORDER.indexOf(currentView);

      const nextView = VIEW_ORDER[currentViewIdx + 1];
      return {
        ...state,
        activeView: nextView,
      };
    });
  },
}));
