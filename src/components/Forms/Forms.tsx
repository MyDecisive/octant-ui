import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { type SubmitEvent, useContext } from "react";
import { StepDefinitions } from "../../constants";
import { FormContext, NavContext } from "../../context/Context";
import { Nav } from "../Nav";
import CheckboxGroup from "./CheckboxGroup";
import RadioButtonsGroup from "./RadioButtonsGroup";

const exportOptions = [
  { label: "Datadog", value: "datadog", inputLabel: "Datadog site URL" },
  { label: "OTLP GRPC", value: "otlp_grpc", inputLabel: "Port number" },
  { label: "OTLP HTTP", value: "otlp_http", inputLabel: "OTLP URL" },
];

const telemetryOptions = [
  { label: "Logs", value: "logs" },
  { label: "Metrics", value: "metrics" },
  { label: "Traces", value: "traces" },
];

export function Forms() {
  const { activeStep, handleSetActiveStep } = useContext(NavContext);
  const { formData, setFormData } = useContext(FormContext);
  const nextStep = StepDefinitions.find(
    (step) => step.id === activeStep.id + 1,
  );
  const isLastStep = activeStep.id === StepDefinitions.length;

  // TODO: Better validation handling, add format validation
  const isRequiredNotProvided =
    (activeStep.id === 1 && !formData.targetRevisionBranch) ||
    (activeStep.id === 2 && (!formData.collectorName || !formData.apiKey)) ||
    (activeStep.id === 3 && !formData.exportLocation) ||
    (activeStep.id === 4 &&
      (!formData.dataTypes || formData.dataTypes.length === 0));

  const handleNextStep = () => {
    if (nextStep) {
      handleSetActiveStep(nextStep);
      console.log("Form data:", formData);
    }
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLastStep) {
      handleNextStep();
      return;
    }

    console.log("Submitting final payload:", formData);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, pb: 8, mt: 2 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: 3,
          border: "1px solid #e5e5e5",
          minHeight: 620,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "230px 1px 1fr" },
            gap: 3,
          }}
        >
          <Nav />
          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", md: "block" } }}
          />

          <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 620 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {activeStep.title}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {activeStep.description}
            </Typography>

            <Stack spacing={2} sx={{ mt: 3 }}>
              {activeStep.id === 1 && (
                <TextField
                  label="Target branch"
                  size="small"
                  sx={{ maxWidth: 360 }}
                  value={formData.targetRevisionBranch || ""}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      targetRevisionBranch: event.target.value,
                    }))
                  }
                  required
                />
              )}

              {activeStep.id === 2 && (
                <>
                  <TextField
                    label="Name your collector"
                    value={formData.collectorName || ""}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        collectorName: event.target.value,
                      }))
                    }
                    size="small"
                    required
                  />
                  <TextField
                    label="Namespace (optional)"
                    helperText="The collector will default to the MDAI namespace if you do not provide one."
                    value={formData.namespace || ""}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        namespace: event.target.value,
                      }))
                    }
                    size="small"
                  />
                  <TextField
                    label="Datadog API key"
                    value={formData.apiKey || ""}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        apiKey: event.target.value,
                      }))
                    }
                    placeholder="dd123..."
                    size="small"
                    required
                  />
                </>
              )}

              {activeStep.id === 3 && (
                <>
                  <RadioButtonsGroup
                    values={exportOptions.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                    selected={formData.exportLocationType || "datadog"}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        exportLocationType: event.target.value,
                      }))
                    }
                  />
                  <TextField
                    label={
                      exportOptions.find(
                        (option) =>
                          option.value === formData.exportLocationType,
                      )?.inputLabel || exportOptions[0].inputLabel
                    }
                    size="small"
                    sx={{ maxWidth: 360 }}
                    value={formData.exportLocation || ""}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        exportLocation: event.target.value,
                      }))
                    }
                    required
                  />
                </>
              )}

              {activeStep.id === 4 && (
                <CheckboxGroup
                  values={telemetryOptions}
                  selected={formData.dataTypes || []}
                  onChange={(selectedValues) =>
                    setFormData((prev) => ({
                      ...prev,
                      dataTypes: selectedValues,
                    }))
                  }
                />
              )}

              <Button
                variant="contained"
                size="small"
                type={isLastStep ? "submit" : "button"}
                onClick={isLastStep ? undefined : handleNextStep}
                sx={{ alignSelf: "flex-start", textTransform: "none" }}
                disabled={isRequiredNotProvided}
              >
                {isLastStep ? "Submit" : "Next"}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
