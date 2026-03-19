import DownloadIcon from "@mui/icons-material/Download";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { type ButtonProps } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useCallback, useState } from "react";
import CodeSnippet from "../../components/CodeSnippet";
import { ViewContent } from "../../components/ViewContent";
import type { BaseFlowViewProps } from "../../types";

import "./ExecuteDeploy.css";

type TabValues = "argo" | "solo";

const tabs = [
  {
    label: "Auto deploy",
    value: "argo",
  },
  {
    label: "Manual deploy",
    value: "solo",
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  value: string;
  active: string;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, active, ...other } = props;

  return (
    <div
      role="tabpanel"
      id={`simple-tabpanel-${value}`}
      aria-labelledby={`simple-tab-${value}`}
      className={`execute-deploy-tab-panel${active === value ? " visible" : ""}`}
      {...other}
    >
      {active === value && <Stack gap={2}>{children}</Stack>}
    </div>
  );
}

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
  const [activeTab, setActiveTab] = useState<TabValues>("argo");
  const [loading, setLoading] = useState(false);
  const [hasDeployed, setHasDeployed] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const handleTabChange = (_e: React.SyntheticEvent, tab: TabValues) => {
    setActiveTab(tab);
  };

  const handleDeployButtonClick = useCallback(() => {
    setLoading(true);
    void fakeTestDataFidelity().then(() => {
      setLoading(false);
      setHasDeployed(true);
    });
  }, []);

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
          <CustomTabPanel active={activeTab} value="argo">
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
              loadingPosition="start"
              loading={loading}
              disabled={loading}
              variant={variant}
              color={color}
            >
              {text}
            </Button>
          </CustomTabPanel>
          <CustomTabPanel active={activeTab} value="solo">
            <Typography
              variant="body2"
              className="execute-deploy-self-tab-header-description"
            >
              First download your manifest. Then place the app and collector
              files in their respective directories to keep your setup
              organized. For more help, check
            </Typography>
            <Button
              variant="secondary"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadButtonClick}
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
          </CustomTabPanel>
        </Stack>
      }
      buttonDisabled={!(hasDeployed || hasDownloaded)}
      onButtonClick={onClickProgress}
    />
  );
}
