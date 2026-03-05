import { createContext } from "react";
import { StepDefinitions } from "../constants";
import {
  type Action,
  type ConnectionPayloadProps,
  type StepProps,
  type Store,
} from "../types";

export interface NavContextValueProps {
  activeStep: StepProps;
  handleSetActiveStep: (step: StepProps) => void;
}

export interface FormContextValueProps {
  formData: ConnectionPayloadProps;
  setFormData: React.Dispatch<React.SetStateAction<ConnectionPayloadProps>>;
  resetFormData: () => void;
}

export const NavContext = createContext<NavContextValueProps>({
  activeStep: StepDefinitions[0],
  handleSetActiveStep: () => {},
});

export const FormContext = createContext<FormContextValueProps>({
  formData: {},
  setFormData: () => {},
  resetFormData: () => {},
});

export function createDefaultAppState(): Store {
  return {
    nav: {
      activeStep: 1,
    },
    form: {
      exportLocationType: "datadog",
    },
  };
}

export const AppState = createContext<[Store, (arg: Action) => void]>([
  createDefaultAppState(),
  () => {},
]);
