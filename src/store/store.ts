import { create } from "zustand";
import type { ConnectionPayloadProps, ViewKey } from "../types";

interface Values {
  activeView: ViewKey;
  form: ConnectionPayloadProps;
}

interface Actions {
  setActiveView: (newView: ViewKey) => void;
  setFormField: (
    key: keyof ConnectionPayloadProps,
    value: ConnectionPayloadProps[keyof ConnectionPayloadProps],
  ) => void;
  resetForm: () => void;
}

type OctantConnectStore = Values & Actions;

function createDefaultOctantConnectForm(): ConnectionPayloadProps {
  return {
    deployMethod: "argo",
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
