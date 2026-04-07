import { TabPanel } from "@components/TabPanel";
import { ViewContent } from "@components/ViewContent";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import type { BaseFlowViewProps } from "@types";

import { ArgoDeploy } from "./ArgoDeploy";
import "./ExecuteDeploy.css";
import { SoloDeploy } from "./SoloDeploy";
import { useExecuteDeployHandlers } from "./useExecuteDeployHandlers";

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

export function ExecuteDeploy({ onClickProgress }: BaseFlowViewProps) {
  const {
    activeTab,
    handleTabChange,
    hasDeployed,
    hasDownloaded,
    onDeployFinish,
    onDownloadFinish,
  } = useExecuteDeployHandlers();

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
            <ArgoDeploy
              hasDeployed={hasDeployed}
              onDeployFinish={onDeployFinish}
            />
          </TabPanel>
          <TabPanel activeValue={activeTab} value="solo">
            <SoloDeploy
              hasDownloaded={hasDownloaded}
              onDownloadFinish={onDownloadFinish}
            />
          </TabPanel>
        </Stack>
      }
      buttonDisabled={!(hasDeployed || hasDownloaded)}
      onButtonClick={onClickProgress}
    />
  );
}
