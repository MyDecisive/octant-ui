import { AsyncNextButton } from "@components/AsyncNextButton";
import { Input } from "@components/formInputs/Input";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import Alert from "@mui/material/Alert";
import { useOctantConnectStore } from "@store";
import { useState, type ChangeEventHandler } from "react";
import { useShallow } from "zustand/shallow";
import { validateRequired } from "../../fieldValidation/validateRequired";
import { validateUrlInput } from "../../fieldValidation/validateUrlInput";
import { argoCdServiceClient } from "../../services/argoCd";

function validateArgoUrl(value: string) {
  const requiredError = validateRequired(value);
  if (requiredError) return requiredError;

  return validateUrlInput(value);
}

export function ConnectToCluster() {
  const [urlError, setUrlError] = useState<string | undefined | null>(null);
  const [tokenError, setTokenError] = useState<string | undefined | null>(null);
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
  const advanceInstallFlow = useOctantConnectStore(
    useShallow((state) => state.advanceInstallFlow),
  );
  const setFormField = useOctantConnectStore(
    useShallow((state) => state.setFormField),
  );

  const handleUrlChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormField("argoUrl", e.target.value);
    setUrlError(null);
  };

  const handleUrlValidation = () => {
    setUrlError(validateArgoUrl(argoUrl));
  };

  const handleTokenChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormField("accountToken", e.target.value);
    setTokenError(null);
  };

  const handleTokenValidation = () => {
    setTokenError(validateRequired(accountToken));
  };

  const testArgoConnection = async () => {
    try {
      const result = await argoCdServiceClient.testConnection({
        argoAccountToken: accountToken,
        argoEndpoint: argoUrl,
      });

      if (result.success) {
        advanceInstallFlow();
        return;
      }
      setConnectionError(
        "Token is invalid. Please regenerate your token and try again.",
      );
      // eslint-disable-next-line
    } catch (_) {
      setConnectionError(
        "Oops, we couldn't verify your ArgoCD connection. Please double check your entries and try again.",
      );
    }
  };

  return (
    <FlowCenterColumn>
      <ViewTitle
        title="Connect to your Kubernetes Cluster"
        description="<Provide ArgoCD somethings and validate connection>"
      />

      <Input
        value={argoUrl}
        onChange={handleUrlChange}
        onBlur={handleUrlValidation}
        error={!!urlError}
        success={urlError === undefined}
        label="ArgoCD Cluster URL"
        placeholder="e.g. https://www.main.com"
        tooltip={
          "Target Argo URL is where these changes will live in your version control platform. Please make sure this Argo URL changes as your promote this change through your SDLC environments."
        }
        helperText={
          urlError ??
          "The dedicated branch that Argo CD will track and sync from"
        }
      />
      <Input
        value={accountToken}
        onChange={handleTokenChange}
        onBlur={handleTokenValidation}
        error={!!tokenError}
        label="ArgoCD API token"
        placeholder="argocd.token.xxxxxxxx"
        helperText={
          tokenError ??
          "Generate this in Argo CD under Settings/Accounts/generate token"
        }
      />
      {connectionError && (
        <Alert variant="filled" color="error">
          {connectionError}
        </Alert>
      )}
      <AsyncNextButton
        asyncFunction={testArgoConnection}
        canAsync={tokenError === undefined && urlError === undefined}
        loadingText={"Connecting"}
      />
    </FlowCenterColumn>
  );
}
