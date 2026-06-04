import { AsyncButton } from "@components/AsyncButton";
import { PageContainer } from "@components/layout/PageContainer";
import { Stack } from "@mui/material";
import { useOctantStore } from "@store/octantStore";
import { useSettingsStore } from "@store/settingsStore";
import type { TelemetryTypes } from "@types";
import { fromMLTTypes } from "@utils/fromMltTypes";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { connectionServiceClient } from "../../services/connection";
import { dDogServiceClient } from "../../services/ddog";
import { SECRET_VALUE_MASK } from "../../constants/forms";
import { getSubmittedCollectorValue } from "../../utils/maskedDDValues";
import { DeployCollectorForm } from "../DeployCollectorForm";
import "./Settings.css";

function telemetryTypesMatch(
  currentTelemetryTypes: TelemetryTypes[],
  savedTelemetryTypes: TelemetryTypes[],
) {
  return (
    currentTelemetryTypes.length === savedTelemetryTypes.length &&
    currentTelemetryTypes.every((type) => savedTelemetryTypes.includes(type))
  );
}

export function Settings() {
  const [telemetryTypes, setTelemetryTypes] = useState<TelemetryTypes[]>([]);
  const [savedTelemetryTypes, setSavedTelemetryTypes] = useState<
    TelemetryTypes[]
  >([]);
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [hasDatadogIntegration, setHasDatadogIntegration] = useState(false);

  const { connectionName, namespace } = useOctantStore(
    useShallow(({ connectionName, namespace }) => ({
      connectionName,
      namespace,
    })),
  );
  const { settingsStatus, showSettingsError, updateSettings } =
    useSettingsStore(
      useShallow(({ showError, status, updateSettings }) => ({
        settingsStatus: status,
        showSettingsError: showError,
        updateSettings,
      })),
    );

  const hasSettingsChanges =
    !telemetryTypesMatch(telemetryTypes, savedTelemetryTypes) ||
    !!url.trim() ||
    !!apiKey.trim();
  const loading = settingsStatus === "loading";

  useEffect(() => {
    if (!connectionName) return;

    let ignore = false;
    const activeConnectionName = connectionName;

    async function loadSettingsDefaults() {
      const [connection, datadogIntegrations] = await Promise.all([
        connectionServiceClient
          .getConnection({ connectionName: activeConnectionName })
          .catch(() => null),
        dDogServiceClient.getDatadogIntegrations({}).catch(() => null),
      ]);

      if (ignore) return;

      const savedTelemetryTypes = connection?.connectionData?.telemetryTypes;
      if (savedTelemetryTypes) {
        const nextTelemetryTypes = fromMLTTypes(savedTelemetryTypes);
        setTelemetryTypes(nextTelemetryTypes);
        setSavedTelemetryTypes(nextTelemetryTypes);
      }

      setHasDatadogIntegration(
        !!datadogIntegrations?.names.includes(activeConnectionName),
      );
    }

    void loadSettingsDefaults();

    return () => {
      ignore = true;
    };
  }, [connectionName]);

  const handleUpdateSettings = async () => {
    if (!connectionName || !namespace) {
      showSettingsError("No active connection was found for these settings.");
      return false;
    }

    const updated = await updateSettings({
      connectionName,
      namespace,
      telemetryTypes,
      datadogUrl: getSubmittedCollectorValue(url),
      datadogApiKey: getSubmittedCollectorValue(apiKey),
    });

    if (!updated) {
      return false;
    }

    setSavedTelemetryTypes(telemetryTypes);
    setHasDatadogIntegration(true);
    setUrl("");
    setApiKey("");
    return true;
  };

  return (
    <PageContainer>
      <Stack direction={"row"} spacing={3} className="settings-form-container">
        <DeployCollectorForm
          telemetryTypes={telemetryTypes}
          url={url}
          apiKey={apiKey}
          connectionName={connectionName}
          onTelemetryTypesChange={setTelemetryTypes}
          onUrlChange={setUrl}
          onApiKeyChange={setApiKey}
          apiKeyRequired={false}
          urlRequired={false}
          disabled={loading}
          submitEnabled={hasSettingsChanges}
          urlPlaceholder={hasDatadogIntegration ? SECRET_VALUE_MASK : undefined}
          apiKeyPlaceholder={
            hasDatadogIntegration ? SECRET_VALUE_MASK : undefined
          }
          renderSubmitAction={({ canSubmit, validate }) => (
            <AsyncButton
              asyncFunction={() => {
                if (!validate()) return Promise.resolve(false);
                return handleUpdateSettings();
              }}
              canAsync={canSubmit}
              text="Update settings"
              loadingText="Updating settings"
            />
          )}
        />
      </Stack>
    </PageContainer>
  );
}
