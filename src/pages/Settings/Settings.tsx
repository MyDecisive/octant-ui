import { AsyncButton } from "@components/AsyncButton";
import { CodeSnippet } from "@components/CodeSnippet";
import { Dialog } from "@components/Dialog";
import { PageContainer } from "@components/layout/PageContainer";
import { RichTooltip } from "@components/RichTooltip";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import FileDownloadRounded from "@mui/icons-material/FileDownloadRounded";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useOctantStore } from "@store/octantStore";
import { useSettingsStore } from "@store/settingsStore";
import type { TelemetryTypes } from "@types";
import { fromMLTTypes } from "@utils/fromMltTypes";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { DeployCollectorForm } from "../../components/DeployCollectorForm";
import { SECRET_VALUE_MASK } from "../../constants/forms";
import { SettingsCopy as copy } from "../../copy/settings/Settings.copy";
import { dDogServiceClient } from "../../services/ddog";
import {
  getSubmittedCollectorValue,
  isMaskedCollectorValue,
} from "../../utils/maskedDDValues";
import { useFetchManifestsAndDownload } from "../../utils/useFetchManifestsAndDownload";
import { createForwardDataSnippets } from "../UpdateAgent/createForwardDataSnippets";
import "./Settings.css";

const DATADOG_SITE_PLACEHOLDER = "<datadog_site_url>";

interface AgentUpdateSnippets {
  locationUrl: string;
  code: string;
}

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
  const [savedUrl, setSavedUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [agentUpdateSnippets, setAgentUpdateSnippets] =
    useState<AgentUpdateSnippets | null>(null);

  const { connectionName, connectionTelemetryTypes, namespace } =
    useOctantStore(
      useShallow(({ connection }) => ({
        connectionName: connection?.scope?.connectionName,
        connectionTelemetryTypes: connection?.telemetryTypes,
        namespace: connection?.scope?.namespace,
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
  const { loading: manifestsLoading, fetchAndDownload } =
    useFetchManifestsAndDownload({
      connectionName,
      namespace,
      telemetryTypes,
      mdaiVersion: "0.10.0",
    });

  const handleDownloadManifestsClick = () => {
    void fetchAndDownload();
  };

  const hasSettingsChanges =
    !telemetryTypesMatch(telemetryTypes, savedTelemetryTypes) ||
    url.trim() !== savedUrl.trim() ||
    (!!apiKey.trim() && !isMaskedCollectorValue(apiKey));
  const loading = settingsStatus === "loading";

  useEffect(() => {
    if (!connectionName) return;

    let ignore = false;
    const activeConnectionName = connectionName;

    async function loadSettingsDefaults() {
      const [datadogIntegrations, datadogIntegration] = await Promise.all([
        dDogServiceClient.getDatadogIntegrations({}).catch(() => null),
        dDogServiceClient
          .getDatadogIntegrationByName({ name: activeConnectionName })
          .catch(() => null),
      ]);

      if (ignore) return;

      if (connectionTelemetryTypes) {
        const nextTelemetryTypes = fromMLTTypes(connectionTelemetryTypes);
        setTelemetryTypes(nextTelemetryTypes);
        setSavedTelemetryTypes(nextTelemetryTypes);
      }

      const hasDatadogIntegration =
        !!datadogIntegrations?.names.includes(activeConnectionName);

      if (hasDatadogIntegration && datadogIntegration?.url) {
        setUrl(datadogIntegration.url);
        setSavedUrl(datadogIntegration.url);
      }

      if (hasDatadogIntegration) {
        setApiKey(SECRET_VALUE_MASK);
      }
    }

    void loadSettingsDefaults();

    return () => {
      ignore = true;
    };
  }, [connectionName, connectionTelemetryTypes]);

  const handleUpdateSettings = async () => {
    if (!connectionName || !namespace) {
      showSettingsError(copy.updateSettings.missingConnectionError);
      return false;
    }

    const telemetryTypesChanged = !telemetryTypesMatch(
      telemetryTypes,
      savedTelemetryTypes,
    );
    const submittedDatadogUrl =
      url.trim() === savedUrl.trim() ? "" : getSubmittedCollectorValue(url);
    const submittedDatadogApiKey = getSubmittedCollectorValue(apiKey);

    if (telemetryTypesChanged) {
      setAgentUpdateSnippets(
        createForwardDataSnippets({
          connectionName,
          namespace,
          telemetryTypes,
          url: submittedDatadogUrl || url || DATADOG_SITE_PLACEHOLDER,
        }),
      );
    }

    const updated = await updateSettings({
      connectionName,
      namespace,
      telemetryTypes,
      datadogUrl: submittedDatadogUrl,
      datadogApiKey: submittedDatadogApiKey,
    });

    if (!updated) {
      return false;
    }

    setSavedTelemetryTypes(telemetryTypes);
    setSavedUrl(url);
    setApiKey(SECRET_VALUE_MASK);

    return true;
  };

  return (
    <PageContainer
      headerActions={
        <Stack direction={"row"} alignItems={"center"} gap={2}>
          <Button
            variant="secondary"
            size="small"
            disableRipple
            onClick={handleDownloadManifestsClick}
            loading={manifestsLoading}
            startIcon={<FileDownloadRounded />}
          >
            {copy.headerActions.downloadManifests}
          </Button>
          <RichTooltip
            title={copy.headerActions.gitOpsTooltip.title}
            description={copy.headerActions.gitOpsTooltip.description}
            actions={
              <Button
                className="mdai-table-toolbar-tooltip-cta-button"
                variant="text"
                endIcon={<ArrowOutwardRoundedIcon />}
                component="a"
                href={copy.headerActions.gitOpsTooltip.href}
                target="_blank"
                rel="noreferrer"
              >
                {copy.headerActions.gitOpsTooltip.cta}
              </Button>
            }
          >
            <InfoOutlined color="secondary" />
          </RichTooltip>
        </Stack>
      }
    >
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
          renderSubmitAction={({ canSubmit, validate }) => (
            <AsyncButton
              asyncFunction={() => {
                if (!validate()) return Promise.resolve(false);
                return handleUpdateSettings();
              }}
              canAsync={canSubmit}
              text={copy.updateSettings.initial}
              loadingText={copy.updateSettings.activated}
            />
          )}
        />
      </Stack>
      <Dialog
        open={!!agentUpdateSnippets}
        onClose={() => setAgentUpdateSnippets(null)}
        closeOnBackdropClick={false}
        title={copy.updateAgentDialog.title}
        actions={
          <Button
            variant="contained"
            size="small"
            onClick={() => setAgentUpdateSnippets(null)}
          >
            {copy.updateAgentDialog.cta}
          </Button>
        }
      >
        <Stack className="settings-agent-update-dialog-content" gap={2}>
          <Typography variant="body2" color="secondary">
            {copy.updateAgentDialog.description}
          </Typography>
          <Typography variant="body2" color="secondary">
            {copy.updateAgentDialog.instructions}
          </Typography>
          {agentUpdateSnippets && (
            <Stack gap={1}>
              <CodeSnippet code={agentUpdateSnippets.code} maxHeight="320px" />
            </Stack>
          )}
        </Stack>
      </Dialog>
    </PageContainer>
  );
}
