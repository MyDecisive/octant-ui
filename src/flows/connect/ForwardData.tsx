import { Typography } from "@mui/material";
import CodeSnippet from "../../components/CodeSnippet";
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
      mainContent={
        <>
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
        </>
      }
      onButtonClick={onClickProgress}
    />
  );
}
