import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Stepper from "@mui/material/Stepper";
import { useInstallAndConnectStore } from "@store/installAndConnectStore";
import { useLocation, useRoute, type DefaultParams } from "wouter";
import { useShallow } from "zustand/shallow";
import { INSTALL_AND_CONNECT, ROUTES } from "../constants/routing";

export function StepperNav() {
  const [, params] = useRoute<DefaultParams>(ROUTES.INSTALL_STEP);
  const [, navigate] = useLocation();
  const activeStepIndex = parseInt(params?.step ?? "0") - 1;

  const { lastCompletedStep, ...formState } = useInstallAndConnectStore(
    useShallow(
      ({
        connectionName,
        namespace,
        telemetryTypes,
        lastCompletedStep,
        url,
      }) => ({
        connectionName,
        namespace,
        telemetryTypes,
        lastCompletedStep,
        url,
      }),
    ),
  );

  return (
    <Box className="left-column">
      <Stepper activeStep={activeStepIndex} orientation="vertical">
        {INSTALL_AND_CONNECT.map(({ label, path, isAvailable }, index) => {
          const stepNumber = index + 1;
          const previousStepNumber = index;
          const isNotStepAfterOneJustCompleted =
            previousStepNumber > lastCompletedStep;
          const isDisabled =
            !isAvailable(formState) || isNotStepAfterOneJustCompleted;

          return (
            <Step key={label} completed={stepNumber <= lastCompletedStep}>
              <StepButton
                color="inherit"
                onClick={() => navigate(path)}
                disabled={isDisabled}
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
