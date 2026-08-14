import type { UIConnectionData } from "@app-types/contracts";
import { AsyncButton } from "@components/AsyncButton";
import { IntegrationType } from "@mydecisiveai/octant-client";
import { DeploymentType } from "@mydecisiveai/octant-client/dist/octant/v1alpha/type_pb";
import { useInstallAndConnectStore } from "@store/installAndConnectStore";
import { useOctantStore } from "@store/octantStore";
import { toMLTTypes } from "@utils/toMLTTypes";
import { useAdvanceInstallAndConnect } from "@utils/useAdvanceInstallAndConnect";
import { useShallow } from "zustand/shallow";
import { DeployCollectorForm } from "../components/DeployCollectorForm";
import { DeployCollectorCopy as copy } from "../copy/install/DeployCollector.copy";
import { connectionServiceClient } from "../services/connection";
import { dDogServiceClient } from "../services/ddog";
import { getSubmittedCollectorValue } from "../utils/maskedValues";

export function DeployCollector() {
  const advanceInstallFlow = useAdvanceInstallAndConnect();
  const { telemetryTypes, siteHost, apiKey, connectionName, namespace } =
    useInstallAndConnectStore(
      useShallow(
        ({
          telemetryTypes,
          siteHost = "",
          apiKey = "",
          connectionName,
          namespace,
        }) => ({
          telemetryTypes,
          siteHost,
          apiKey,
          connectionName,
          namespace,
        }),
      ),
    );
  const setFormField = useInstallAndConnectStore((state) => state.setFormField);
  const setPartialState = useInstallAndConnectStore(
    (state) => state.setPartialState,
  );
  const setOctantState = useOctantStore((state) => state.setState);

  const handleDeployButtonClick = async () => {
    try {
      const submittedSiteHost = getSubmittedCollectorValue(siteHost);
      const submittedApiKey = getSubmittedCollectorValue(apiKey);

      if (submittedSiteHost && submittedApiKey) {
        await dDogServiceClient.saveDatadogIntegration({
          siteHost: submittedSiteHost,
          apiKey: submittedApiKey,
          name: connectionName,
        });
      }

      const connection: UIConnectionData = {
        scope: {
          connectionName: connectionName!,
          namespace: namespace!,
        },
        telemetryTypes: toMLTTypes(telemetryTypes),
        deployment: {
          type: DeploymentType.ARGO_SIDELOAD,
          integrationName: connectionName!,
        },
        destinations: [
          {
            type: IntegrationType.DATADOG,
            integrationName: connectionName!,
          },
        ],
      };

      await connectionServiceClient.createConnection({
        connectionData: connection,
      });

      setOctantState("connection", connection);
      setPartialState({ telemetryTypes, siteHost, apiKey });

      return true;
    } catch {
      // TODO: [UX] We need error feedback in this component
      return false;
    }
  };

  return (
    <DeployCollectorForm
      telemetryTypes={telemetryTypes}
      siteHost={siteHost}
      apiKey={apiKey}
      connectionName={connectionName}
      onTelemetryTypesChange={(checked) =>
        setFormField("telemetryTypes", checked)
      }
      onSiteHostChange={(nextSiteHost) =>
        setFormField("siteHost", nextSiteHost)
      }
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
