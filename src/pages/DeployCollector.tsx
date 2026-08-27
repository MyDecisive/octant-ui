import type { UIConnectionData } from "@app-types/contracts";
import { AsyncButton } from "@components/AsyncButton";
import { IntegrationType } from "@mydecisiveai/octant-client";
import { DeploymentType } from "@mydecisiveai/octant-client/dist/octant/v1alpha/type_pb";
import { useInstallAndConnectStore } from "@store/installAndConnectStore";
import { useOctantStore } from "@store/octantStore";
import { toMLTTypes } from "@utils/toMLTTypes";
import { useAdvanceInstallAndConnect } from "../hooks/useAdvanceInstallAndConnect";
import { useShallow } from "zustand/shallow";
import { DeployCollectorForm } from "../components/DeployCollectorForm";
import { DeployCollectorCopy as copy } from "../copy/install/DeployCollector.copy";
import { connectionServiceClient } from "../services/connection";
import { dDogServiceClient } from "../services/ddog";
import { getSubmittedCollectorValue } from "../utils/maskedValues";

export function DeployCollector() {
  const advanceInstallFlow = useAdvanceInstallAndConnect();
  const { apiKey, connectionName, namespace, siteHost, telemetryTypes } =
    useInstallAndConnectStore(
      useShallow(
        ({
          apiKey = "",
          connectionName,
          namespace,
          siteHost = "",
          telemetryTypes,
        }) => ({
          apiKey,
          connectionName,
          namespace,
          siteHost,
          telemetryTypes,
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
          apiKey: submittedApiKey,
          name: connectionName,
          siteHost: submittedSiteHost,
        });
      }

      const connection: UIConnectionData = {
        deployment: {
          integrationName: connectionName!,
          type: DeploymentType.ARGO_SIDELOAD,
        },
        destinations: [
          {
            integrationName: connectionName!,
            type: IntegrationType.DATADOG,
          },
        ],
        scope: {
          connectionName: connectionName!,
          namespace: namespace!,
        },
        telemetryTypes: toMLTTypes(telemetryTypes),
      };

      await connectionServiceClient.createConnection({
        connectionData: connection,
      });

      setOctantState("connection", connection);
      setPartialState({ apiKey, siteHost, telemetryTypes });

      return true;
    } catch {
      // TODO: [UX] We need error feedback in this component
      return false;
    }
  };

  return (
    <DeployCollectorForm
      apiKey={apiKey}
      connectionName={connectionName}
      onApiKeyChange={(nextApiKey) => setFormField("apiKey", nextApiKey)}
      onSiteHostChange={(nextSiteHost) =>
        setFormField("siteHost", nextSiteHost)
      }
      onTelemetryTypesChange={(checked) =>
        setFormField("telemetryTypes", checked)
      }
      renderSubmitAction={({ canSubmit, validate }) => (
        <AsyncButton
          asyncFunction={() => {
            if (!validate()) return Promise.resolve(false);
            return handleDeployButtonClick();
          }}
          canAsync={canSubmit}
          loadingText={copy.cta.activated}
          onSuccess={advanceInstallFlow}
          text={copy.cta.initial}
        />
      )}
      siteHost={siteHost}
      telemetryTypes={telemetryTypes}
    />
  );
}
