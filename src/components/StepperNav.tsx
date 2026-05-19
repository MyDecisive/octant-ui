import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Stepper from "@mui/material/Stepper";
import { useLocation, useRoute, type DefaultParams } from "wouter";
import { INSTALL_AND_CONNECT, ROUTES } from "../constants/routing";

export function StepperNav() {
  const [, params] = useRoute<DefaultParams>(ROUTES.INSTALL_STEP);
  const [, navigate] = useLocation();
  const activeStepIndex = parseInt(params?.step ?? "0") - 1;

  return (
    <Box className="left-column">
      <Stepper activeStep={activeStepIndex} orientation="vertical">
        {INSTALL_AND_CONNECT.map(({ label }, index) => {
          return (
            <Step key={label} completed={index < activeStepIndex}>
              <StepButton
                color="inherit"
                onClick={() =>
                  navigate(`${ROUTES.INSTALL}/${(index + 1).toString()}`)
                }
                disabled={index > activeStepIndex} // TODO: refactor disabled logic
              >
                {label}
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
