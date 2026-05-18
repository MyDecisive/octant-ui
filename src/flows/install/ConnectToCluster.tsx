import { Alert } from "@components/Alert";
import { AsyncNextButton } from "@components/AsyncNextButton";
import { Input } from "@components/formInputs/Input";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import { useConnectStore } from "@store/connectStore";
import { useOctantStore } from "@store/octantStore";
import type { FormFields } from "@types";
import { useState, type ChangeEventHandler } from "react";
import { useShallow } from "zustand/shallow";
import { useFormValidation } from "../../fieldValidation/useFormValidation";
import { validateMinLength } from "../../fieldValidation/validateMinLength";
import { validateRequired } from "../../fieldValidation/validateRequired";
import { validateUrlInput } from "../../fieldValidation/validateUrlInput";
import { argoCdServiceClient } from "../../services/argoCd";
import { ConnectToClusterCopy as copy }  from "../../copy/ConnectToCluster.copy";

const formSpec: FormFields = {
  connectionName: [validateRequired, validateMinLength(5)],
  argoUrl: [validateRequired, validateUrlInput],
  accountToken: [validateRequired],
};

export function ConnectToCluster() {
  const { callbacks, formIsValid, validateAll } = useFormValidation(formSpec);
  const [connectionError, setConnectionError] = useState<string | undefined>();
  const { argoUrl, accountToken, connectionName } = useConnectStore(
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
  const setFormField = useConnectStore(
    useShallow((state) => state.setFormField),
  );
  const setState = useOctantStore((state) => state.setState);

  const handleUrlChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormField("argoUrl", e.target.value);
  };

  const handleTokenChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormField("accountToken", e.target.value);
  };

  const testArgoConnection = async () => {
    if (
      !validateAll({
        argoUrl,
        accountToken,
        connectionName: decodeURI(connectionName),
      })
    ) {
      return false;
    }

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
      setState("connectionName", connectionName);
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
        title={copy.header}
        description={copy.subheader}
      />
      <Input
        value={decodeURI(connectionName)}
        onChange={(e) =>
          setFormField("connectionName", encodeURI(e.target.value))
        }
        {...callbacks.connectionName}
        placeholder={copy.nameThisConnection.label}
        helperText={copy.nameThisConnection.helpTxt}
      />
      <Input
        value={argoUrl}
        onChange={handleUrlChange}
        {...callbacks.argoUrl}
        label={copy.argoUrl.label}
        placeholder={copy.argoUrl.placeholder}
        tooltip={copy.argoUrl.tooltip}
        helperText={copy.argoUrl.helpTxt}
      />
      <Input
        value={accountToken}
        onChange={handleTokenChange}
        {...callbacks.accountToken}
        label={copy.argoToken.label}
        placeholder={copy.argoToken.placeholder}
        helperText={copy.argoToken.helpTxt}
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
