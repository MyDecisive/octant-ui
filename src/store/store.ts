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

type ConnectStore = Values & Actions;

export const useConnect = create<ConnectStore>()((set) => ({
  activeStep: 1,
  form: {},
  setActiveStep: (newStep) =>
    set((state) => ({ ...state, activeStep: newStep })),
  setFormField: (key, value) =>
    set((state) => ({ ...state, form: { ...state.form, [key]: value } })),
  resetForm: () => set((state) => ({ ...state, form: {} })),
}));
