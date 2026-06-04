import { AsyncButton } from "@components/AsyncButton";
import { IntegrationType } from "@mydecisiveai/octant-client";
import { DeploymentType } from "@mydecisiveai/octant-client/dist/octant/v1alpha/type_pb";
import { useInstallAndConnectStore } from "@store/installAndConnectStore";
import { toMLTTypes } from "@utils/toMltTypes";
import { useAdvanceInstallAndConnect } from "@utils/useAdvanceInstallAndConnect";
import { useShallow } from "zustand/shallow";
import { DeployCollectorForm } from "../components/DeployCollectorForm";
import { DeployCollectorCopy as copy } from "../copy/install/DeployCollector.copy";
import { connectionServiceClient } from "../services/connection";
import { dDogServiceClient } from "../services/ddog";
import { getSubmittedCollectorValue } from "../utils/maskedDDValues";

export function DeployCollector() {
  const advanceInstallFlow = useAdvanceInstallAndConnect();
  const { telemetryTypes, url, apiKey, connectionName, namespace } =
    useInstallAndConnectStore(
      useShallow(
        ({
          // Provide default empty string values so React recognizes the Inputs as controlled
          telemetryTypes,
          url = "",
          apiKey = "",
          connectionName,
          namespace,
        }) => ({
          telemetryTypes,
          url,
          apiKey,
          connectionName,
          namespace,
        }),
      ),
    );
  const setFormField = useInstallAndConnectStore((state) => state.setFormField);

  const handleDeployButtonClick = async () => {
    try {
      const submittedUrl = getSubmittedCollectorValue(url);
      const submittedApiKey = getSubmittedCollectorValue(apiKey);

      if (submittedUrl && submittedApiKey) {
        await dDogServiceClient.saveDatadogIntegration({
          url: submittedUrl,
          apiKey: submittedApiKey,
          name: connectionName,
        });
      }

      await connectionServiceClient.createConnection({
        connectionData: {
          scope: {
            connectionName,
            namespace,
          },
          telemetryTypes: toMLTTypes(telemetryTypes),
          deployment: {
            type: DeploymentType.ARGO_SIDELOAD,
            integrationName: connectionName,
          },
          destinations: [
            {
              type: IntegrationType.DATADOG,
              integrationName: connectionName,
            },
          ],
        },
      });

      return true;
      // eslint-disable-next-line
    } catch (_) {
      // TODO: We need error feedback in this component
      return false;
    }
  };

  return (
    <DeployCollectorForm
      telemetryTypes={telemetryTypes}
      url={url}
      apiKey={apiKey}
      connectionName={connectionName}
      onTelemetryTypesChange={(checked) =>
        setFormField("telemetryTypes", checked)
      }
      onUrlChange={(nextUrl) => setFormField("url", nextUrl)}
      onApiKeyChange={(nextApiKey) => setFormField("apiKey", nextApiKey)}
      renderSubmitAction={({ canSubmit, validate }) => (
        <AsyncButton
          asyncFunction={() => {
            if (!validate()) return Promise.resolve(false);
            return handleDeployButtonClick();
          }}
          canAsync={canSubmit}
          text={copy.cta.initial}
          loadingText={copy.cta.activated}
          onSuccess={advanceInstallFlow}
        />
      )}
    />
  );
}
