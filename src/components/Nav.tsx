import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import React, { use, useCallback } from "react";
import { StepDefinitions } from "../constants";
import { AppState } from "../context/Context";
import { ACTION_TYPES } from "../context/store";

export function Nav() {
  const [state, dispatch] = use(AppState);

  const { form, nav } = state;
  const { activeStep } = nav;

  const handleSetActiveStep = useCallback(
    (stepId: number) => {
      dispatch({
        type: ACTION_TYPES.SET_ACTIVE_STEP,
        payload: stepId,
      });
    },
    [dispatch],
  );

  const handleResetFormData = useCallback(() => {
    dispatch({
      type: ACTION_TYPES.RESET_FORM_DATA,
    });
  }, [dispatch]);

  const handleReset = () => {
    handleSetActiveStep(0);
    handleResetFormData();
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
