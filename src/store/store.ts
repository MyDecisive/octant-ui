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

function createDefaultOctantConnectForm(): AppStateForm {
  return {
    argoAgreement: false,
    namespace: "mdai",
    telemetryTypes: [],
    mdaiVersion: "0.9.3-octant",
  };
}

function createDefaultOctantConnectState() {
  return {
    activeView: "nextSteps",
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
