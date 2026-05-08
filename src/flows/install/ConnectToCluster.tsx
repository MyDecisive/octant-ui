import { Alert } from "@components/Alert";
import { AsyncNextButton } from "@components/AsyncNextButton";
import { Input } from "@components/formInputs/Input";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import { useOctantConnectStore } from "@store/connectStore";
import type { FormFields } from "@types";
import { useState, type ChangeEventHandler } from "react";
import { useShallow } from "zustand/shallow";
import { useFormValidation } from "../../fieldValidation/useFormValidation";
import { validateRequired } from "../../fieldValidation/validateRequired";
import { validateUrlInput } from "../../fieldValidation/validateUrlInput";
import { argoCdServiceClient } from "../../services/argoCd";

const formSpec: FormFields = {
  connectionName: [validateRequired],
  argoUrl: [validateRequired, validateUrlInput],
  accountToken: [validateRequired],
};

export function ConnectToCluster() {
  const { callbacks, formIsValid, validateAll } = useFormValidation(formSpec);
  const [connectionError, setConnectionError] = useState<string | undefined>();
  const { argoUrl, accountToken, connectionName } = useOctantConnectStore(
    useShallow((state) => {
      // Provide default empty string values so React recognizes the Inputs as controlled
      const {
        argoUrl = "",
        accountToken = "",
        connectionName = "",
      } = state.form;

      return {
        argoUrl,
        accountToken,
        connectionName,
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
    if (!validateAll({ argoUrl, accountToken, connectionName })) return false;
    try {
      const result = await argoCdServiceClient.testConnection({
        argoAccountToken: accountToken,
        argoEndpoint: argoUrl,
      });

      if (!result.success) {
        setConnectionError(
          "Credentials are invalid. Please regenerate your token, check your URL, and try again.",
        );
        return false;
      }

      await argoCdServiceClient.saveArgoConnection({
        argoAccountToken: accountToken,
        argoEndpoint: argoUrl,
        name: connectionName,
      });

      return true;
      // eslint-disable-next-line
    } catch (_) {
      setConnectionError(
        "We hit an issue setting up your ArgoCD connection. Please double check your entries and try again.",
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
        value={decodeURI(connectionName)}
        onChange={(e) =>
          setFormField("connectionName", encodeURI(e.target.value))
        }
        {...callbacks.connectionName}
        placeholder="Name this connection"
        helperText="We recommend providing a name that can be easily referenced later, e.g., datadog-io"
      />
      <Input
        value={argoUrl}
        onChange={handleUrlChange}
        {...callbacks.argoUrl}
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
        {...callbacks.accountToken}
        label="ArgoCD API token"
        placeholder="argocd.token.xxxxxxxx"
        helperText={
          "Generate this in Argo CD under Settings/Accounts/generate token"
        }
      />
      {connectionError && <Alert severity="error" title={connectionError} />}
      <AsyncNextButton
        asyncFunction={testArgoConnection}
        canAsync={formIsValid}
        loadingText={"Connecting"}
        isSubmit
      />
    </FlowCenterColumn>
  );
}
