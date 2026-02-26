import { createContext } from "react";
import { navSteps } from "../constants";
import type { StepProps } from "../types";

export interface NavContextValueProps {
  activeStep: StepProps;
  handleSetActiveStep: (step: StepProps) => void;
}

export const NavContext = createContext<NavContextValueProps>({
  activeStep: navSteps[0],
  handleSetActiveStep: () => {},
});
