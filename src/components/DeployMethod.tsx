import Box from "@mui/material/Box";
import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { useOctantConnectStore } from "../store/store";
import { Input } from "./FormInputs/Input";
import RadioButtonsGroup from "./FormInputs/RadioButtonsGroup";
import { ViewContent } from "./ViewContent";

const deployMethodOptions = [
  { label: "Yes, deploy on my behalf", value: "argo" },
  { label: "No, I will deploy on my own", value: "self" },
];

export function DeployMethod({
  onClickProgress,
}: {
  onClickProgress: () => void;
}) {
  const { deployMethod, branch, accountToken } = useOctantConnectStore(
    useShallow((state) => {
      // Provide default empty string values so React recognizes the Inputs as controlled
      const { deployMethod, branch = "", accountToken = "" } = state.form;

      return {
        deployMethod,

        branch,
        accountToken,
      };
    }),
  );
  const setFormField = useOctantConnectStore((state) => state.setFormField);

  const handleSetDeployMethod = useCallback(
    (method: "argo" | "self") => {
      setFormField("deployMethod", method);
      if (method === "self") {
        setFormField("accountToken", undefined);
        setFormField("branch", undefined);
      }
    },
    [setFormField],
  );

  const canClickNextButton = useMemo(() => {
    if (deployMethod === "argo") {
      return !!(branch.length && accountToken.length);
    }

    return true;
  }, [deployMethod, branch, accountToken]);

  return (
    <ViewContent
      title="Deploy Directly to Your Argo CD Server?"
      description={
        <>
          We are about to create some Argo apps. Let us know if you’re
          comfortable with us directly pushing those apps to your Argo CD server
          on your behalf.
          <br />
          <br />
          Note: Do not deploy to a branch that is actively in development (ex.
          production environment).
        </>
      }
      formContent={
        <>
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
                  value={branch}
                  onChange={(e) => setFormField("branch", e.target.value)}
                  required
                  placeholder="Target branch"
                  tooltip="Target branch is where these changes will live in your version control platform. Please make sure this branch changes as your promote this change through your SDLC environments."
                />
                <Input
                  value={accountToken}
                  onChange={(e) => setFormField("accountToken", e.target.value)}
                  required
                  placeholder="Argo account token?"
                />
              </>
            )}
          </Box>
        </>
      }
      onButtonClick={onClickProgress}
      buttonDisabled={!canClickNextButton}
    />
  );
}
