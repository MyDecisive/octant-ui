import { create } from "zustand";
import type { ConnectionPayloadProps } from "../types";

interface Values {
  activeStep: number;
  form: ConnectionPayloadProps;
}

interface Actions {
  setActiveStep: (newStep: number) => void;
  setFormField: (
    key: keyof ConnectionPayloadProps,
    value: ConnectionPayloadProps[keyof ConnectionPayloadProps],
  ) => void;
  resetForm: () => void;
}

type OctantConnectStore = Values & Actions;

export const useOctantConnectStore = create<OctantConnectStore>()((set) => ({
  activeStep: 1,
  form: {},
  setActiveStep: (newStep) =>
    set((state) => ({ ...state, activeStep: newStep })),
  setFormField: (key, value) =>
    set((state) => ({ ...state, form: { ...state.form, [key]: value } })),
  resetForm: () => set((state) => ({ ...state, form: {} })),
}));
