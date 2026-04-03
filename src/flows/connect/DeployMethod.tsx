import { Input } from "@components/FormInputs/Input";
import { RadioButtonsGroup } from "@components/FormInputs/RadioButtonsGroup";
import { ViewContent } from "@components/ViewContent";
import Stack from "@mui/material/Stack";
import { useOctantConnectStore } from "@store";
import type { BaseFlowViewProps } from "@types";
import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/shallow";

const deployMethodOptions = [
  { label: "Yes, deploy on my behalf", value: "argocd" },
  { label: "No, I will deploy on my own", value: "self" },
];

export function DeployMethod({ onClickProgress }: BaseFlowViewProps) {
  const { deployMethod, accountToken, argoUrl } = useOctantConnectStore(
    useShallow((state) => {
      // Provide default empty string values so React recognizes the Inputs as controlled
      const { deployMethod, argoUrl = "", accountToken = "" } = state.form;

      return {
        deployMethod,
        argoUrl,
        accountToken,
      };
    }),
  );
  const setFormField = useOctantConnectStore((state) => state.setFormField);

  const handleSetDeployMethod = useCallback(
    (method: "argocd" | "self") => {
      setFormField("deployMethod", method);
      if (method === "self") {
        setFormField("accountToken", undefined);
        setFormField("argoUrl", undefined);
      }
    },
    [setFormField],
  );

  const canClickNextButton = useMemo(() => {
    if (deployMethod === "argocd") {
      return !!(accountToken.length && argoUrl.length);
    }

    return true;
  }, [deployMethod, accountToken, argoUrl]);

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
      mainContent={
        <>
          <Stack gap={1}>
            <RadioButtonsGroup
              values={deployMethodOptions}
              selected={deployMethod}
              onChange={(event) =>
                handleSetDeployMethod(event.target.value as "argocd" | "self")
              }
            />
            {deployMethod === "argocd" && (
              <>
                <Input
                  value={argoUrl}
                  onChange={(e) => setFormField("argoUrl", e.target.value)}
                  required
                  placeholder="Argo repository URL"
                />
                <Input
                  value={accountToken}
                  onChange={(e) => setFormField("accountToken", e.target.value)}
                  required
                  placeholder="Argo account token?"
                />
              </>
            )}
          </Stack>
        </>
      }
      onButtonClick={onClickProgress}
      buttonDisabled={!canClickNextButton}
    />
  );
}
