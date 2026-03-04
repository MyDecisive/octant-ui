import { useState } from "react";
import { StepDefinitions } from "../constants";
import type { ConnectionPayloadProps, StepProps } from "../types";
import { FormContext, NavContext } from "./Context";

const initialFormData: ConnectionPayloadProps = {
  targetRevisionBranch: "",
  collectorName: "",
  namespace: "",
  apiKey: "",
  exportLocationType: "datadog",
  exportLocation: "",
  dataTypes: [],
};

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [activeStep, setActiveStep] = useState(StepDefinitions[0]);
  const [formData, setFormData] = useState<ConnectionPayloadProps>({
    ...initialFormData,
  });

  function handleSetActiveStep(step: StepProps) {
    setActiveStep(step);
  }

  function resetFormData() {
    setFormData({ ...initialFormData });
  }

  return (
    <NavContext.Provider value={{ activeStep, handleSetActiveStep }}>
      <FormContext.Provider value={{ formData, setFormData, resetFormData }}>
        {children}
      </FormContext.Provider>
    </NavContext.Provider>
  );
}
