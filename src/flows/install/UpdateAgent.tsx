import { CodeSnippet } from "@components/CodeSnippet";
import { DataFidelityCard } from "@components/DataFidelityCard/DataFidelityCard";
import { ButtonRow } from "@components/layout/ButtonRow";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { NextButton } from "@components/NextButton";
import { TabPanel } from "@components/TabPanel";
import { ViewTitle } from "@components/ViewTitle";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useOctantConnectStore } from "@store";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { createForwardDataSnippets } from "../createForwardDataSnippets";

export function UpdateAgent() {
  const [activeTab, setActiveTab] = useState<string>("update");
  const [hasTested, setIsValid] = useState(false);

  const { connectionName, url, namespace } = useOctantConnectStore(
    useShallow((state) => ({
      connectionName: state.form.connectionName,
      url: state.form.url,
      namespace: state.form.namespace,
    })),
  );
  const forwardDataSnippets = createForwardDataSnippets({
    connectionName,
    url,
    namespace,
  });

  return (
    <FlowCenterColumn>
      <ViewTitle
        title="Update Datadog agent and test data flow in our Smarthub"
        description="Update your Datadog agent config in your Kubernetes cluster or Argo CD project and restart it with the updated manifest changes."
      />

      <Tabs value={activeTab} onChange={(_, tab: string) => setActiveTab(tab)}>
        <Tab
          value="update"
          label="Update Datadog agent"
          aria-controls={"update-control-tab"}
        />
        <Tab
          value="test"
          label={"Test connection and data fidelity"}
          icon={<CheckCircleOutlineOutlined />}
          iconPosition="end"
          aria-controls={"test-control-tab"}
        />
      </Tabs>
      <TabPanel activeValue={activeTab} value="update">
        <Stack gap={2} className="forward-data-code-snippets">
          {forwardDataSnippets.map(({ title, code }) => (
            <Stack key={title}>
              <Typography variant="subtitle2">{title}</Typography>
              <CodeSnippet code={code} maxHeight="150px" />
            </Stack>
          ))}
        </Stack>
      </TabPanel>
      <TabPanel activeValue={activeTab} value="test">
        <DataFidelityCard setIsValid={setIsValid} />
      </TabPanel>
      <ButtonRow>
        <NextButton disabled={!hasTested} />
      </ButtonRow>
    </FlowCenterColumn>
  );
}
