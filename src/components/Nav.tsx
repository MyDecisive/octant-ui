import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import React from "react";
import { StepDefinitions } from "../constants";
import { useConnect } from "../store/store";

export function Nav() {
  const activeStep = useConnect((state) => state.activeStep);
  const form = useConnect((state) => state.form);
  const setActiveStep = useConnect((state) => state.setActiveStep);
  const resetForm = useConnect((state) => state.resetForm);

  const handleReset = () => {
    setActiveStep(0);
    resetForm();
    console.log("Form data reset", form);
  };

  const activeStepIdx = StepDefinitions.findIndex(
    (step) => step.id === activeStep,
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Button onClick={handleReset}>Reset</Button>
      <Stepper activeStep={activeStepIdx} orientation="vertical">
        {StepDefinitions.map(({ id, title }) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={id} {...stepProps}>
              <StepLabel {...labelProps}>{title}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
