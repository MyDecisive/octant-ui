import { useState } from "react";
import { StepDefinitions } from "../constants";
import type { StepProps } from "../types";
import { NavContext } from "./Context";

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [activeStep, setActiveStep] = useState(StepDefinitions[0]);

  function handleSetActiveStep(step: StepProps) {
    setActiveStep(step);
  }

  return (
    <NavContext.Provider value={{ activeStep, handleSetActiveStep }}>
      {children}
    </NavContext.Provider>
  );
}
