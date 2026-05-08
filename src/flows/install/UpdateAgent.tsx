import { CodeSnippet } from "@components/CodeSnippet";
import { CheckboxGroup } from "@components/formInputs/CheckboxGroup";
import { ButtonRow } from "@components/layout/ButtonRow";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { NextButton } from "@components/NextButton";
import { ViewTitle } from "@components/ViewTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useConnectStore } from "@store/connectStore";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { createForwardDataSnippets } from "../createForwardDataSnippets";

export function UpdateAgent() {
  const [confirmed, setConfirmed] = useState(false);

  const { telemetryTypes, connectionName, url, namespace } = useConnectStore(
    useShallow((state) => ({
      connectionName: state.form.connectionName,
      url: state.form.url,
      namespace: state.form.namespace,
      telemetryTypes: state.form.telemetryTypes,
    })),
  );
  const { locationUrl, code } = createForwardDataSnippets({
    connectionName: connectionName!,
    url: url!,
    namespace,
    telemetryTypes,
  });

  return (
    <>
      <FlowCenterColumn>
        <ViewTitle
          title="Update Datadog agent and test data flow in our Smarthub"
          description={
            <Typography variant="body2" color="secondary">
              Update your Datadog agent config in your Kubernetes cluster or
              Argo CD project and restart it with the updated manifest changes.
              <br />
              <br />
              To update, you’ll need to copy and paste the code snippet of the
              data type(s) you previously selected.
            </Typography>
          }
        />
        <CheckboxGroup
          selected={confirmed ? ["confirmed"] : []}
          onChange={(values) => setConfirmed(!!values.length)}
          options={[
            {
              value: "confirmed",
              label: "I have updated the Datadog agent and I am ready to test",
            },
          ]}
        />
        <ButtonRow>
          <NextButton disabled={!confirmed} />
          <Typography variant="chipLabel">
            This process will take about 5 minutes.
          </Typography>
        </ButtonRow>
      </FlowCenterColumn>
      <Stack className="right-column" gap={3}>
        <Typography variant="body2" bold>
          Paste the following code snippets in your Datadog agent:
        </Typography>
        <Stack gap={1}>
          <Typography variant="body2">MyDecisive location URL</Typography>
          <CodeSnippet code={locationUrl} maxHeight="150px" />
        </Stack>
        <Stack gap={1}>
          <Typography variant="body2">Then do this:</Typography>
          <CodeSnippet code={code} maxHeight="440px" />
        </Stack>
      </Stack>
    </>
  );
}
