import { CodeSnippet } from "@components/CodeSnippet";
import { ViewContent } from "@components/ViewContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useOctantConnectStore } from "@store";
import type { BaseFlowViewProps } from "@types";
import { useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { createForwardDataSnippets } from "./ForwardDataUtils";

export function ForwardData({ onClickProgress }: BaseFlowViewProps) {
  const { connectionName, url } = useOctantConnectStore(
    useShallow((state) => ({
      connectionName: state.form.connectionName,
      url: state.form.url,
    })),
  );
  const forwardDataSnippets = useMemo(
    () => createForwardDataSnippets({ connectionName, url }),
    [connectionName, url],
  );

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
          <Stack gap={2} className="forward-data-code-snippets">
            {forwardDataSnippets.map(({ title, code }) => (
              <Stack key={title}>
                <Typography variant="subtitle2">{title}</Typography>
                <CodeSnippet code={code} maxHeight="200px" />
              </Stack>
            ))}
          </Stack>
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
