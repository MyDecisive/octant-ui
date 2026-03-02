import { createContext } from "react";
import { navSteps } from "../constants";
import type { FormProps, StepProps } from "../types";

export interface NavContextValueProps {
  activeStep: StepProps;
  handleSetActiveStep: (step: StepProps) => void;
}

export interface FormContextValueProps {
  activeForm: FormProps;
  handleSetActiveForm: (form: FormProps) => void;
}

export const NavContext = createContext<NavContextValueProps>({
  activeStep: navSteps[0],
  handleSetActiveStep: () => {},
});

export const FormContext = createContext<FormContextValueProps>({
  activeForm: {},
  handleSetActiveForm: () => {},
});
