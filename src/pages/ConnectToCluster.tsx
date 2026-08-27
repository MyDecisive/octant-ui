import type { FormFields } from "@app-types/validation";
import { Alert } from "@components/Alert";
import { AsyncButton } from "@components/AsyncButton";
import { Input } from "@components/formInputs/Input";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import { useInstallAndConnectStore } from "@store/installAndConnectStore";
import { isMaskedValue } from "@utils/maskedValues";
import { useAdvanceInstallAndConnect } from "../hooks/useAdvanceInstallAndConnect";
import { useState, type ChangeEventHandler } from "react";
import { useShallow } from "zustand/shallow";
import { ConnectToClusterCopy as copy } from "../copy/install/ConnectToCluster.copy";
import { useFormValidation } from "../hooks/useFormValidation";
import { validateMinLength } from "../fieldValidation/validateMinLength";
import { validateRequired } from "../fieldValidation/validateRequired";
import { validateUrlInput } from "../fieldValidation/validateUrlInput";
import { argoCdServiceClient } from "../services/argoCd";

const formSpec: FormFields = {
  connectionName: [validateRequired, validateMinLength(5)],
  argoUrl: [validateRequired, validateUrlInput],
  accountToken: [validateRequired],
};

export function ConnectToCluster() {
  const advanceInstallFlow = useAdvanceInstallAndConnect();
  const { callbacks, formIsValid, validateAll } = useFormValidation(formSpec);
  const [connectionError, setConnectionError] = useState<string | undefined>();

  const { url, token, connName } = useInstallAndConnectStore(
    useShallow(({ argoUrl, accountToken, connectionName }) => ({
      url: argoUrl,
      token: accountToken,
      connName: connectionName,
    })),
  );

  const [argoUrl, setArgoUrl] = useState(url ?? "");
  const [accountToken, setAccountToken] = useState(token ?? "");
  const [connectionName, setConnectionName] = useState(connName ?? "");

  const setPartialState = useInstallAndConnectStore(
    useShallow((state) => state.setPartialState),
  );

  const handleUrlChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setArgoUrl(e.target.value);
  };

  const handleTokenChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setAccountToken(e.target.value);
  };

  const handleConnectionNameChange: ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    setConnectionName(encodeURI(e.target.value));
  };

  const tokenIsMasked = isMaskedValue(token);

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
    if (isMaskedValue(accountToken) || !accountToken) {
      return true;
    }
    try {
      const result = await argoCdServiceClient.testConnection({
        argoAccountToken: accountToken,
        argoEndpoint: argoUrl,
      });

      if (!result.success) {
        setConnectionError(copy.formError.argoSpecificError);
        return false;
      }

      await argoCdServiceClient.saveArgoConnection({
        argoAccountToken: accountToken,
        argoEndpoint: argoUrl,
        name: connectionName,
      });
      setPartialState({ accountToken, argoUrl, connectionName });
      return true;
    } catch {
      setConnectionError(copy.formError.genericError);
      return false;
    }
  };

  return (
    <FlowCenterColumn isForm>
      <ViewTitle title={copy.header} description={copy.subheader} />
      <Input
        value={decodeURI(connectionName)}
        onChange={handleConnectionNameChange}
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
        tooltip={
          tokenIsMasked
            ? "This field is masked because you have already completed this page. To update, just enter a new value. Leaving this field unchanged will use the previously entered value"
            : undefined
        }
      />
      {connectionError && (
        <Alert
          severity="error"
          title={copy.formError.header}
          description={connectionError}
        />
      )}
      <AsyncButton
        asyncFunction={testArgoConnection}
        canAsync={formIsValid}
        loadingText={copy.ctaTxt.activated}
        text={copy.ctaTxt.initial}
        isSubmit
        onSuccess={advanceInstallFlow}
      />
    </FlowCenterColumn>
  );
}
