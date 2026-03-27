import { CodeSnippet } from "@components/CodeSnippet";
import { TabPanel } from "@components/TabPanel";
import { ViewContent } from "@components/ViewContent";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import DownloadIcon from "@mui/icons-material/Download";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { Link, type ButtonProps } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import type { BaseFlowViewProps } from "@types";
import { useState } from "react";
import { useShallow } from "zustand/shallow";

import { useOctantConnectStore } from "@store";
import { appStateFormToConnectionPayload } from "@utils/appStateFormToConnectionPayload";
import {
  connections,
  integrations,
  type ArgoCdIntegrationBody,
  type DatadogIntegrationBody,
} from "../../services/api";
import "./ExecuteDeploy.css";

type TabValues = "argocd" | "solo";

const tabs = [
  {
    label: "Auto deploy",
    value: "argocd",
  },
  {
    label: "Manual deploy",
    value: "solo",
  },
];

function determineDeployButtonProps(
  loading: boolean,
  hasTested: boolean,
): {
  text: string;
  variant: ButtonProps["variant"];
  color?: ButtonProps["color"];
} {
  if (loading) {
    return {
      text: "Deploying...",
      variant: "secondary",
    };
  }

  if (hasTested) {
    return {
      text: "Done",
      variant: "contained",
      color: "success",
    };
  }

  return {
    text: "Deploy collector",
    variant: "secondary",
  };
}

async function fakeTestDataFidelity() {
  return await new Promise((resolve) => setTimeout(resolve, 1500));
}

export function ExecuteDeploy({ onClickProgress }: BaseFlowViewProps) {
  const [activeTab, setActiveTab] = useState<TabValues>("argocd");
  const [loading, setLoading] = useState(false);
  const [hasDeployed, setHasDeployed] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [deployError, setDeployError] = useState<string | null>(null);
  const form = useOctantConnectStore(useShallow((state) => state.form));

  const handleTabChange = (_e: React.SyntheticEvent, tab: TabValues) => {
    setActiveTab(tab);
  };

  const handleDeployButtonClick = () => {
    if (
      !form.connectionName ||
      !form.url ||
      !form.apiKey ||
      !form.accountToken
    ) {
      return;
    }

    const connectionPayload = appStateFormToConnectionPayload(form);
    const ddIntegrationPayload: DatadogIntegrationBody = {
      url: form.url,
      apiKey: form.apiKey,
    };
    const argoIntegrationPayload: ArgoCdIntegrationBody = {
      accountToken: form.accountToken,
    };

    setDeployError(null);
    setLoading(true);
    void Promise.all([
      connections.upsert(form.connectionName, connectionPayload),
      integrations.upsert("datadog", form.connectionName, ddIntegrationPayload),
      integrations.upsert(
        "argocd",
        form.connectionName,
        argoIntegrationPayload,
      ),
    ])
      .then(() => {
        setHasDeployed(true);
      })
      .catch((error: unknown) => {
        console.error("Failed to deploy collector", error);
        setDeployError(
          error instanceof Error
            ? error.message
            : "Something went wrong while deploying the collector.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const { text, variant, color } = determineDeployButtonProps(
    loading,
    hasDeployed,
  );

  const handleDownloadButtonClick = () => {
    setLoading(true);
    void fakeTestDataFidelity().then(() => {
      setLoading(false);
      setHasDownloaded(true);
    });
  };

  return (
    <ViewContent
      title="Choose how to deploy your collector"
      description="Choose how you'd like to deploy your collector. We can handle it for you automatically, or generate the configuration files for you to deploy on your own terms."
      mainContent={
        <Stack gap={2}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            {tabs.map(({ label, value }) => (
              <Tab
                key={label}
                label={label}
                value={value}
                aria-controls={`${value}-control-tab`}
              />
            ))}
          </Tabs>
          <TabPanel activeValue={activeTab} value="argocd">
            <Stack gap={0.5}>
              <Stack
                gap={0.5}
                className="execute-deploy-argo-tab-header-title-container"
              >
                <WarningAmberOutlinedIcon color="warning" />
                <Typography variant="h6">
                  Updating your ArgoCD server
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                className="execute-deploy-argo-tab-header-description"
              >
                We’re about to force update your Argo CD server with this
                collector. Don’t worry, we’ll provide the raw manifests for
                version control later.
              </Typography>
            </Stack>
            <Button
              onClick={handleDeployButtonClick}
              size="small"
              loadingPosition="start"
              loading={loading}
              disabled={loading}
              variant={variant}
              color={color}
            >
              {text}
            </Button>
            {deployError && (
              <Typography variant="body2" color="error">
                Deploy failed: {deployError}
              </Typography>
            )}
          </TabPanel>
          <TabPanel activeValue={activeTab} value="solo">
            <Typography
              variant="body2"
              className="execute-deploy-self-tab-header-description"
            >
              First download your manifest. Then place the app and collector
              files in their respective directories to keep your setup
              organized. For more help, check{" "}
              <Link
                className="execute-deploy-self-link"
                href={
                  "https://argo-cd.readthedocs.io/en/latest/operator-manual/cluster-bootstrapping/#app-of-apps-pattern-alternative"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Argo Docs
                <ArrowOutwardRoundedIcon />
              </Link>
            </Typography>
            <Button
              variant="secondary"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadButtonClick}
              size="small"
              loading={loading}
              disabled={loading}
              loadingPosition="start"
            >
              Download manifests
            </Button>

            <CodeSnippet
              // TODO: Update this code when we figure it out
              code={"dir. tree of Argo goes here"}
              copyButton={false}
            />
          </TabPanel>
        </Stack>
      }
      buttonDisabled={!(hasDeployed || hasDownloaded)}
      onButtonClick={onClickProgress}
    />
  );
}
