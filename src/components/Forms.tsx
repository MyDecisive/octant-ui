import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { use, useCallback, useMemo, useState } from "react";
import { StepDefinitions } from "../constants";
import { AppState } from "../context/Context";
import { ACTION_TYPES } from "../context/store";
import { Nav } from "./Nav";

export function Forms() {
  const [state, dispatch] = use(AppState);

  const { nav, form } = state;
  const { activeStep } = nav;

  const handleSetActiveStep = useCallback(
    (newActiveStep: number) => {
      dispatch({
        type: ACTION_TYPES.SET_ACTIVE_STEP,
        payload: newActiveStep,
      });
    },
    [dispatch],
  );

  const handleSetFieldValue = useCallback(
    (fieldName: string, value: unknown) => {
      dispatch({
        type: ACTION_TYPES.SET_FORM_FIELD,
        payload: {
          fieldName,
          value,
        },
      });
    },
    [dispatch],
  );

  const currentStep = useMemo(
    () => StepDefinitions.find((step) => step.id === activeStep),
    [activeStep],
  );

  const handleResetFormData = useCallback(() => {
    dispatch({
      type: ACTION_TYPES.RESET_FORM_DATA,
    });
  }, [dispatch]);

  const nextStep = useMemo(
    () => StepDefinitions.find((step) => step.id === activeStep + 1),
    [activeStep],
  );
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleConnect = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (connectionStatus === "loading") return;

    setConnectionStatus("loading");
    const shouldSucceed = Math.random() >= 0.5;
    const delayMs = 900 + Math.round(Math.random() * 800);

    window.setTimeout(() => {
      setConnectionStatus(shouldSucceed ? "success" : "error");
    }, delayMs);
  };

  const handleNextStep = () => {
    if (nextStep) {
      handleSetActiveStep(nextStep.id);
      console.log("Form data:", form);
    }
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

          <Box sx={{ maxWidth: 620 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {currentStep.title}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {currentStep.description}
            </Typography>

            <Stack spacing={2} sx={{ mt: 3 }}>
              {activeStep === 1 && (
                <>
                  <TextField
                    label="Target branch"
                    placeholder="main"
                    size="small"
                    sx={{ maxWidth: 360 }}
                    value={form.targetRevisionBranch || ""}
                    onChange={(event) =>
                      handleSetFieldValue(
                        "targetRevisionBranch",
                        event.target.value,
                      )
                    }
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleNextStep}
                    sx={{ alignSelf: "flex-start", textTransform: "none" }}
                  >
                    Next
                  </Button>
                </>
              )}

              {activeStep === 2 && (
                <>
                  <Typography variant="subtitle2" sx={{ color: "#171717" }}>
                    Select integration
                  </Typography>

                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleNextStep}
                    sx={{ alignSelf: "flex-start", textTransform: "none" }}
                  >
                    Next
                  </Button>
                </>
              )}

              {activeStep === 3 && (
                <Box
                  component="form"
                  onSubmit={handleConnect}
                  sx={{ display: "grid", gap: 1.5, maxWidth: 420 }}
                >
                  <TextField
                    label="Datadog API key"
                    value={form.apiKey || ""}
                    onChange={(event) =>
                      handleSetFieldValue("apiKey", event.target.value)
                    }
                    placeholder="dd123..."
                    size="small"
                  />
                  <Button
                    variant="contained"
                    type="submit"
                    size="small"
                    disabled={connectionStatus === "loading" || !form.apiKey}
                    sx={{ alignSelf: "flex-start", textTransform: "none" }}
                  >
                    {connectionStatus === "loading"
                      ? "Connecting..."
                      : "Connect"}
                  </Button>
                  <Box minHeight={24}>
                    {connectionStatus === "loading" && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={14} />
                        <Typography variant="caption" sx={{ color: "#616161" }}>
                          Waiting for response...
                        </Typography>
                      </Stack>
                    )}
                    {connectionStatus === "success" && (
                      <Typography variant="caption" color="success.main">
                        HTTP 200: Connected
                      </Typography>
                    )}
                    {connectionStatus === "error" && (
                      <Typography variant="caption" color="error.main">
                        HTTP 500: Try again
                      </Typography>
                    )}
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleNextStep}
                    sx={{ alignSelf: "flex-start", textTransform: "none" }}
                  >
                    Next
                  </Button>
                </Box>
              )}

              {activeStep === 4 && (
                <>
                  <Typography variant="body2" sx={{ color: "#616161" }}>
                    Final configuration step. Connect options and control
                    settings will appear here.
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      handleSetActiveStep(0);
                      handleResetFormData();
                    }}
                    sx={{ alignSelf: "flex-start", textTransform: "none" }}
                  >
                    Start over
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
