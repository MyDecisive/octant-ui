import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import CodeSnippet from "../../components/CodeSnippet";
import InfoAlert from "../../components/InfoAlert";
import { ViewContent } from "../../components/ViewContent";

export function ForwardData({
  onClickProgress,
}: {
  onClickProgress: () => void;
}) {
  return (
    <ViewContent
      title="Forward your telemetry from Datadog agent to OTel collector"
      description={
        <>
          Update your Datadog agent config in your Kubernetes cluster or Argo CD
          project and restart it with the updated manifest changes.
        </>
      }
      formContent={
        <Stack gap={3}>
          <CodeSnippet
            code={
              "COPY THE MYDECISIVE LOCATION: URL\n" +
              "http://<name>-collector.<namespace>.svc.cluster.local:8126"
            }
          />
          <CodeSnippet code={"code snippet goes here [for logs, do this]"} />
          <CodeSnippet code={"code snippet goes here [for traces, do this]"} />
          <CodeSnippet code={"code snippet goes here [for metrics]"} />
          <Typography variant="body2" color="textSecondary">
            When your Datadog agent is ready with the updated configuration
            changes to continue deployment.
          </Typography>
        </Stack>
      }
      onButtonClick={onClickProgress}
      sidebarContent={
        <InfoAlert
          title={"Update URL in Datadog"}
          message={
            "Now that you’ve provided a name for the collector and namespace, you’ll need to go to your Datadog agent to update the URL."
          }
        />
      }
    />
  );
}
