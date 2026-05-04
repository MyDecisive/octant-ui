import { Alert } from "@components/Alert";
import { AsyncNextButton } from "@components/AsyncNextButton";
import { Input } from "@components/formInputs/Input";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import { useOctantConnectStore } from "@store";
import type { InputValidationErrors } from "@types";
import { useState, type ChangeEventHandler } from "react";
import { useShallow } from "zustand/shallow";
import { validateRequired } from "../../fieldValidation/validateRequired";
import { validateUrlInput } from "../../fieldValidation/validateUrlInput";
import { argoCdServiceClient } from "../../services/argoCd";

function validateArgoUrl(value?: string) {
  const requiredError = validateRequired(value);
  if (requiredError) return requiredError;

  return validateUrlInput(value!);
}

export function ConnectToCluster() {
  const [urlError, setUrlError] = useState<InputValidationErrors | null>(null);
  const [tokenError, setTokenError] = useState<InputValidationErrors | null>(
    null,
  );
  const [connectionError, setConnectionError] = useState<string | undefined>();
  const { argoUrl, accountToken } = useOctantConnectStore(
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
  const setFormField = useOctantConnectStore(
    useShallow((state) => state.setFormField),
  );

  const handleUrlChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormField("argoUrl", e.target.value);
  };

  const handleTokenChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormField("accountToken", e.target.value);
  };

  const testArgoConnection = async () => {
    try {
      const result = await argoCdServiceClient.testConnection({
        argoAccountToken: accountToken,
        argoEndpoint: argoUrl,
      });

      if (result.success) {
        return true;
      }
      setConnectionError(
        "Token is invalid. Please regenerate your token and try again.",
      );
      return false;
      // eslint-disable-next-line
    } catch (_) {
      setConnectionError(
        "Oops, we couldn't verify your ArgoCD connection. Please double check your entries and try again.",
      );
      return false;
    }
  };

  return (
    <FlowCenterColumn isForm>
      <ViewTitle
        title="Connect to your Kubernetes Cluster"
        description="<Provide ArgoCD somethings and validate connection>"
      />

      <Input
        value={argoUrl}
        onChange={handleUrlChange}
        validate={validateArgoUrl}
        onValidation={setUrlError}
        label="ArgoCD Cluster URL"
        placeholder="e.g. https://www.main.com"
        tooltip={
          "Target Argo URL is where these changes will live in your version control platform. Please make sure this Argo URL changes as your promote this change through your SDLC environments."
        }
        helperText={
          "The dedicated branch that Argo CD will track and sync from"
        }
      />
      <Input
        value={accountToken}
        onChange={handleTokenChange}
        validate={validateRequired}
        onValidation={setTokenError}
        label="ArgoCD API token"
        placeholder="argocd.token.xxxxxxxx"
        helperText={
          "Generate this in Argo CD under Settings/Accounts/generate token"
        }
      />
      {connectionError && <Alert severity="error" title={connectionError} />}
      <AsyncNextButton
        asyncFunction={testArgoConnection}
        canAsync={urlError === undefined && tokenError === undefined}
        loadingText={"Connecting"}
        isSubmit
      />
    </FlowCenterColumn>
  );
}
