import { useState } from "react";
import type { StepProps } from "../types";
import { navSteps } from "../constants";
import { NavContext } from "./Context";

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [activeStep, setActiveStep] = useState(navSteps[0]);

  function handleSetActiveStep(step: StepProps) {
    setActiveStep(step);
  }

  return (
    <NavContext.Provider value={{ activeStep, handleSetActiveStep }}>
      <button
        className="nav-item active"
        onClick={() => setActiveStep(navSteps[0])}
      >
        Reset
      </button>
      {children}
    </NavContext.Provider>
  );
}
