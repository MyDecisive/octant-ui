import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { type SubmitEvent, useMemo, useState } from "react";
import { StepDefinitions } from "../../constants";
import { connections, integrations } from "../../services/api";
import { useOctantConnectStore } from "../../store/store";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const activeStep = useOctantConnectStore((state) => state.activeView);
  const form = useOctantConnectStore((state) => state.form);
  const setActiveStep = useOctantConnectStore((state) => state.setActiveView);
  const setFormField = useOctantConnectStore((state) => state.setFormField);

  const currentStep = useMemo(() => {
    return (
      StepDefinitions.find((step) => step.id === activeStep) ||
      StepDefinitions[0]
    );
  }, [activeStep]);

  const isLastStep = activeStep === StepDefinitions.length;

  // TODO: Better validation handling, add format validation
  const isRequiredNotProvided =
    (activeStep === 1 && !form.targetRevisionBranch) ||
    (activeStep === 2 && (!form.collectorName || !form.apiKey)) ||
    (activeStep === 3 && !form.exportLocation) ||
    (activeStep === 4 && (!form.dataTypes || form.dataTypes.length === 0));

  const handleNextStep = () => {
    if (!isLastStep) {
      const currStepIdx = StepDefinitions.findIndex(
        (step) => step.id === activeStep,
      );
      const nextActiveStep = StepDefinitions[currStepIdx + 1].id;

      setActiveStep(nextActiveStep);
      console.log("Form data:", form);
    }
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLastStep) {
      handleNextStep();
      return;
    }

    setLoading(true);
    void integrations
      .upsert(
        form.exportLocationType!,
        form.collectorName!,
        form.exportLocationType === "datadog"
          ? {
              apiKey: form.apiKey!,
              ddUrl: form.exportLocation!,
            }
          : {
              url: form.exportLocation!,
            },
      )
      .then(() => {
        void connections.upsert(form.collectorName!, {
          receives: [
            {
              type: form.exportLocationType!,
              dataTypes: form.dataTypes!,
            },
          ],
          exports: [
            {
              type: form.exportLocationType!,
              integrations: [
                {
                  type: form.exportLocationType!,
                  name: form.collectorName!,
                },
              ],
            },
          ],
          deployment: {
            type: "argocd",
            data: {
              branch: form.targetRevisionBranch!,
            },
          },
        });
      })
      .catch((e: Error) => setError(e))
      .finally(() => setLoading(false));

    console.log("Submitting final payload:", form);
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
              {currentStep.title}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {currentStep.description}
            </Typography>
            {error && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {`Something went wrong: ${error}`}
              </Typography>
            )}

            <Stack spacing={2} sx={{ mt: 3 }}>
              {activeStep === 1 && (
                <TextField
                  label="Target branch"
                  size="small"
                  sx={{ maxWidth: 360 }}
                  value={form.targetRevisionBranch || ""}
                  onChange={(event) =>
                    setFormField("targetRevisionBranch", event.target.value)
                  }
                  required
                />
              )}

              {activeStep === 2 && (
                <>
                  <TextField
                    label="Name your collector"
                    value={form.collectorName || ""}
                    onChange={(event) =>
                      setFormField("collectorName", event.target.value)
                    }
                    size="small"
                    required
                  />
                  <TextField
                    label="Namespace (optional)"
                    helperText="The collector will default to the MDAI namespace if you do not provide one."
                    value={form.namespace || ""}
                    onChange={(event) =>
                      setFormField("namespace", event.target.value)
                    }
                    size="small"
                  />
                  <TextField
                    label="Datadog API key"
                    value={form.apiKey || ""}
                    onChange={(event) =>
                      setFormField("apiKey", event.target.value)
                    }
                    placeholder="dd123..."
                    size="small"
                    required
                  />
                </>
              )}

              {activeStep === 3 && (
                <>
                  <RadioButtonsGroup
                    values={exportOptions.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                    selected={form.exportLocationType || "datadog"}
                    onChange={(event) =>
                      setFormField("exportLocationType", event.target.value)
                    }
                  />
                  <TextField
                    label={
                      exportOptions.find(
                        (option) => option.value === form.exportLocationType,
                      )?.inputLabel || exportOptions[0].inputLabel
                    }
                    size="small"
                    sx={{ maxWidth: 360 }}
                    value={form.exportLocation || ""}
                    onChange={(event) =>
                      setFormField("exportLocation", event.target.value)
                    }
                    required
                  />
                </>
              )}

              {activeStep === 4 && (
                <CheckboxGroup
                  values={telemetryOptions}
                  selected={form.dataTypes || []}
                  onChange={(selectedValues) =>
                    setFormField("dataTypes", selectedValues)
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
                loading={isLastStep && loading}
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
