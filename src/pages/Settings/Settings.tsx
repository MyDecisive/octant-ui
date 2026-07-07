import type { TelemetryTypes } from "@app-types/enums";
import { AsyncButton } from "@components/AsyncButton";
import { CodeSnippet } from "@components/CodeSnippet";
import { Dialog } from "@components/Dialog";
import { PageContainer } from "@components/layout/PageContainer";
import { RichTooltip } from "@components/RichTooltip";
import { SECRET_VALUE_MASK } from "@copy/global";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import FileDownloadRounded from "@mui/icons-material/FileDownloadRounded";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useOctantStore } from "@store/octantStore";
import { useSettingsStore } from "@store/settingsStore";
import { fromMLTTypes } from "@utils/fromMLTTypes";
import { getSubmittedCollectorValue, isMaskedValue } from "@utils/maskedValues";
import { toMLTTypes } from "@utils/toMLTTypes";
import { useFetchManifestsAndDownload } from "../../hooks/useFetchManifestsAndDownload";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { DeployCollectorForm } from "../../components/DeployCollectorForm";
import { SettingsCopy as copy } from "../../copy/settings/Settings.copy";
import { dDogServiceClient } from "../../services/ddog";
import { createForwardDataSnippets } from "../UpdateAgent/createForwardDataSnippets";
import "./Settings.css";

const DATADOG_SITE_PLACEHOLDER = "<datadog_site_url>";

interface AgentUpdateSnippets {
  code: string;
  locationUrl: string;
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
  const [siteHost, setSiteHost] = useState("");
  const [savedSiteHost, setSavedSiteHost] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [agentUpdateSnippets, setAgentUpdateSnippets] =
    useState<AgentUpdateSnippets | null>(null);

  const {
    connectionName,
    connectionTelemetryTypes,
    namespace,
    setInConnection,
  } = useOctantStore(
    useShallow(({ connection, setInConnection }) => ({
      connectionName: connection?.scope?.connectionName,
      connectionTelemetryTypes: connection?.telemetryTypes,
      namespace: connection?.scope?.namespace,
      setInConnection,
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
  const { fetchAndDownload, loading: manifestsLoading } =
    useFetchManifestsAndDownload({
      connectionName,
      mdaiVersion: "0.10.0",
      namespace,
      telemetryTypes,
    });

  const handleDownloadManifestsClick = () => {
    void fetchAndDownload();
  };

  const hasSettingsChanges =
    !telemetryTypesMatch(telemetryTypes, savedTelemetryTypes) ||
    siteHost.trim() !== savedSiteHost.trim() ||
    (!!apiKey.trim() && !isMaskedValue(apiKey));
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
        setSiteHost(datadogIntegration.url);
        setSavedSiteHost(datadogIntegration.url);
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
      siteHost.trim() === savedSiteHost.trim()
        ? ""
        : getSubmittedCollectorValue(siteHost);
    const submittedDatadogApiKey = getSubmittedCollectorValue(apiKey);

    if (telemetryTypesChanged) {
      setAgentUpdateSnippets(
        createForwardDataSnippets({
          connectionName,
          namespace,
          siteHost: submittedDatadogUrl || siteHost || DATADOG_SITE_PLACEHOLDER,
          telemetryTypes,
        }),
      );
    }

    const updated = await updateSettings({
      connectionName,
      datadogApiKey: submittedDatadogApiKey,
      datadogUrl: submittedDatadogUrl,
      namespace,
      telemetryTypes,
    });

    if (!updated) {
      return false;
    }

    setSavedTelemetryTypes(telemetryTypes);
    setInConnection("telemetryTypes", toMLTTypes(telemetryTypes));
    setSavedSiteHost(siteHost);
    setApiKey(SECRET_VALUE_MASK);

    return true;
  };

  return (
    <PageContainer
      headerActions={
        <Stack alignItems={"center"} direction={"row"} gap={2}>
          <Button
            disableRipple
            loading={manifestsLoading}
            onClick={handleDownloadManifestsClick}
            size="small"
            startIcon={<FileDownloadRounded />}
            variant="secondary"
          >
            {copy.headerActions.downloadManifests}
          </Button>
          <RichTooltip
            actions={
              <Button
                className="mdai-table-toolbar-tooltip-cta-button"
                component="a"
                endIcon={<ArrowOutwardRoundedIcon />}
                href={copy.headerActions.gitOpsTooltip.href}
                rel="noreferrer"
                target="_blank"
                variant="text"
              >
                {copy.headerActions.gitOpsTooltip.cta}
              </Button>
            }
            description={copy.headerActions.gitOpsTooltip.description}
            title={copy.headerActions.gitOpsTooltip.title}
          >
            <InfoOutlined color="secondary" />
          </RichTooltip>
        </Stack>
      }
    >
      <Stack className="settings-form-container" direction={"row"} spacing={3}>
        <DeployCollectorForm
          apiKey={apiKey}
          apiKeyRequired={false}
          connectionName={connectionName}
          disabled={loading}
          onApiKeyChange={setApiKey}
          onSiteHostChange={setSiteHost}
          onTelemetryTypesChange={setTelemetryTypes}
          renderSubmitAction={({ canSubmit, validate }) => (
            <AsyncButton
              asyncFunction={() => {
                if (!validate()) return Promise.resolve(false);
                return handleUpdateSettings();
              }}
              canAsync={canSubmit}
              loadingText={copy.updateSettings.activated}
              text={copy.updateSettings.initial}
            />
          )}
          siteHost={siteHost}
          siteHostRequired={false}
          submitEnabled={hasSettingsChanges}
          telemetryTypes={telemetryTypes}
        />
      </Stack>
      <Dialog
        actions={
          <Button
            onClick={() => setAgentUpdateSnippets(null)}
            size="small"
            variant="contained"
          >
            {copy.updateAgentDialog.cta}
          </Button>
        }
        closeOnBackdropClick={false}
        onClose={() => setAgentUpdateSnippets(null)}
        open={!!agentUpdateSnippets}
        title={copy.updateAgentDialog.title}
      >
        <Stack className="settings-agent-update-dialog-content" gap={2}>
          <Typography color="secondary" variant="body2">
            {copy.updateAgentDialog.description}
          </Typography>
          <Typography color="secondary" variant="body2">
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
