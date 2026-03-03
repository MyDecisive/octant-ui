import { createContext } from "react";
import { StepDefinitions } from "../constants";
import type { ConnectionPayloadProps, StepProps } from "../types";

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
