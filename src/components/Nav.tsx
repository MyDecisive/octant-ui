import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import React, { useContext } from "react";
import { StepDefinitions } from "../constants";
import { NavContext } from "../context/Context";

export function Nav() {
  const { activeStep, handleSetActiveStep } = useContext(NavContext);

  const handleReset = () => {
    handleSetActiveStep(StepDefinitions[0]);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Button onClick={handleReset}>Reset</Button>
      <Stepper
        activeStep={StepDefinitions.indexOf(activeStep)}
        orientation="vertical"
      >
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
