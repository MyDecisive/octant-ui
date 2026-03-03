import { useReducer, useState } from "react";
import { StepDefinitions } from "../constants";
import type { ConnectionPayloadProps, StepProps } from "../types";
import {
  AppState,
  createDefaultAppState,
  FormContext,
  NavContext,
} from "./Context";
import { appReducer } from "./store";

const initialFormData: ConnectionPayloadProps = {
  targetRevisionBranch: "",
  collectorName: "",
  namespace: "",
  integration: "",
  apiKey: "",
  exportLocationType: "",
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

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, createDefaultAppState());

  return (
    <AppState.Provider value={[state, dispatch]}>{children}</AppState.Provider>
  );
}
