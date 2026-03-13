import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { useOctantConnectStore } from "../store/store";
import { Input } from "./FormInputs/Input";
import RadioButtonsGroup from "./FormInputs/RadioButtonsGroup";

const deployMethodOptions = [
  { label: "Yes, deploy on my behalf", value: "argo" },
  { label: "No, I will deploy on my own", value: "self" },
];

export function DeployMethod({
  onClickProgress,
}: {
  onClickProgress: () => void;
}) {
  const {
    deployMethod,

    targetRevisionBranch,
    argoAccountToken,
  } = useOctantConnectStore(
    useShallow((state) => {
      // Provide default empty string values so React recognizes the Inputs as controlled
      const {
        deployMethod,
        targetRevisionBranch = "",
        argoAccountToken = "",
      } = state.form;

      return {
        deployMethod,

        targetRevisionBranch,
        argoAccountToken,
      };
    }),
  );
  const setFormField = useOctantConnectStore((state) => state.setFormField);

  const handleSetDeployMethod = useCallback(
    (method: "argo" | "self") => {
      setFormField("deployMethod", method);
      if (method === "self") {
        setFormField("argoAccountToken", undefined);
        setFormField("targetRevisionBranch", undefined);
      }
    },
    [setFormField],
  );

  const canClickNextButton = useMemo(() => {
    if (deployMethod === "argo") {
      return !!(targetRevisionBranch.length && argoAccountToken.length);
    }

    return true;
  }, [deployMethod, targetRevisionBranch, argoAccountToken]);

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "466px auto", gap: 3 }}>
      <Box sx={{ display: "flex", gap: 3, flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            alignItems: "flex-start",
            alignSelf: "stretch",
          }}
        >
          <Typography variant="h5">
            Deploy Directly to Your Argo CD Server?
          </Typography>
          <Typography variant="body2">
            We are about to create some Argo apps. Let us know if you’re
            comfortable with us directly pushing those apps to your Argo CD
            server on your behalf.
            <br />
            <br />
            Note: Do not deploy to a branch that is actively in development (ex.
            production environment).
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
          <RadioButtonsGroup
            values={deployMethodOptions}
            selected={deployMethod}
            onChange={(event) =>
              handleSetDeployMethod(event.target.value as "argo" | "self")
            }
          />
          {deployMethod === "argo" && (
            <>
              <Input
                value={targetRevisionBranch}
                onChange={(e) =>
                  setFormField("targetRevisionBranch", e.target.value)
                }
                required
                placeholder="Target branch"
                tooltip="Target branch is where these changes will live in your version control platform. Please make sure this branch changes as your promote this change through your SDLC environments."
              />
              <Input
                value={argoAccountToken}
                onChange={(e) =>
                  setFormField("argoAccountToken", e.target.value)
                }
                required
                placeholder="Argo account token?"
              />
            </>
          )}
        </Box>
        <Button
          variant="contained"
          size="small"
          type={"button"}
          onClick={onClickProgress}
          sx={{ alignSelf: "flex-start", textTransform: "none" }}
          disabled={!canClickNextButton}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
