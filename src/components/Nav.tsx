import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Stepper from "@mui/material/Stepper";

export function Nav({
  activeStepIndex,
  steps,
  onStepClick,
}: {
  activeStepIndex: number;
  steps: { title: string; id: string }[];
  onStepClick: (stepKey: string) => void;
}) {
  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStepIndex} orientation="vertical">
        {steps.map(({ id, title }, index) => {
          return (
            <Step key={id} completed={index < activeStepIndex}>
              <StepButton
                color="inherit"
                onClick={() => onStepClick(id)}
                disabled={index > activeStepIndex}
              >
                {title}
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
