import { useContext } from "react";
import { navSteps } from "../constants";
import { NavContext } from "../context/Context";
import type { StepProps } from "../types";

export function Nav() {
  const { activeStep, handleSetActiveStep } = useContext(NavContext);
  return (
    <aside className="wizard-nav">
      <div className="nav-title">Setup flow</div>
      <div className="nav-items">
        {navSteps.map((step: StepProps) => (
          <button
            key={step.id}
            className={`nav-item ${step.id === activeStep.id ? "active" : ""}`}
            type="button"
            onClick={() => handleSetActiveStep(step)}
            disabled={step.id < activeStep.id}
          >
            <span className="step-index">{step.id}</span>
            <span className="step-text">
              <span className="step-title">{step.title}</span>
              <span className="step-subtitle">{step.subtitle}</span>
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
