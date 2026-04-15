import { CodeSnippet } from "@components/CodeSnippet";
import { ButtonRow } from "@components/layout/ButtonRow";
import { CenterColumn } from "@components/layout/CenterColumn";
import { NextButton } from "@components/NextButton";
import { TabPanel } from "@components/TabPanel";
import { ViewTitle } from "@components/ViewTitle";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import type { ButtonProps } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useOctantConnectStore } from "@store";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { connections } from "../../services/api";
import { createForwardDataSnippets } from "../createForwardDataSnippets";

function determineButtonProps(
  loading: boolean,
  hasTested: boolean,
): {
  text: string;
  variant: ButtonProps["variant"];
  color?: ButtonProps["color"];
} {
  if (loading) {
    return {
      text: "Connecting...",
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
    text: "Test and validate data",
    variant: "secondary",
  };
}

export function UpdateAgent() {
  const [activeTab, setActiveTab] = useState<string>("update");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTestedAtLeastOnce, setHasTested] = useState(false);
  const [error, setError] = useState<string | null>();

  const { connectionName, url } = useOctantConnectStore(
    useShallow((state) => ({
      connectionName: state.form.connectionName,
      url: state.form.url,
    })),
  );
  const forwardDataSnippets = createForwardDataSnippets({
    connectionName,
    url,
  });

  const handleTestButtonClick = () => {
    setLoading(true);

    void connections
      .getStatus(connectionName!)
      .then(() => {
        setHasTested(true);
      })
      .catch((error: unknown) => {
        console.log("error getting connection status", error);
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while trying to determine the status of your collector",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const { text, variant, color } = determineButtonProps(
    loading,
    hasTestedAtLeastOnce,
  );

  return (
    <CenterColumn>
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
        <Stack gap={3} className="forward-data-code-snippets">
          {forwardDataSnippets.map(({ title, code }) => (
            <CodeSnippet key={title} code={code} maxHeight="200px" />
          ))}
        </Stack>
      </TabPanel>
      <TabPanel activeValue={activeTab} value="test">
        <div>placeholder for the refactored data table</div>
        <Button
          className="data-fidelity-action-button"
          onClick={handleTestButtonClick}
          loadingPosition="start"
          loading={loading}
          disabled={loading}
          variant={variant}
          color={color}
          size="small"
        >
          {text}
        </Button>
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
      </TabPanel>
      <ButtonRow>
        <NextButton disabled={!hasTestedAtLeastOnce} />
      </ButtonRow>
    </CenterColumn>
  );
}
