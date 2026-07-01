import { CodeSnippet } from "@components/CodeSnippet";
import { CheckboxGroup } from "@components/formInputs/CheckboxGroup";
import { ButtonRow } from "@components/layout/ButtonRow";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { NextButton } from "@components/NextButton";
import { ViewTitle } from "@components/ViewTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useInstallAndConnectStore } from "@store/installAndConnectStore";
import { isDemo } from "@utils/initialization/useDemoValues";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { UpdateAgentCopy as copy } from "../../copy/install/UpdateAgent.copy";
import { createForwardDataSnippets } from "./createForwardDataSnippets";

export function UpdateAgent() {
  const [confirmed, setConfirmed] = useState(isDemo);

  const { telemetryTypes, connectionName, url, namespace } =
    useInstallAndConnectStore(
      useShallow(({ connectionName, url, namespace, telemetryTypes }) => ({
        connectionName,
        url,
        namespace,
        telemetryTypes,
      })),
    );
  const { locationUrl, code } = createForwardDataSnippets({
    connectionName: connectionName!,
    url: url!,
    namespace: namespace!,
    telemetryTypes,
  });

  return (
    <>
      <FlowCenterColumn>
        <ViewTitle
          title={copy.header}
          description={
            <Typography variant="body2" color="secondary">
              {copy.subheader}
            </Typography>
          }
        />
        <CheckboxGroup
          selected={confirmed ? ["confirmed"] : []}
          onChange={(values) => setConfirmed(!!values.length)}
          options={[
            {
              value: "confirmed",
              label: copy.ack,
            },
          ]}
        />
        <ButtonRow>
          <NextButton disabled={!confirmed} ctaTxt={copy.cta} />
          <Typography variant="chipLabel">{copy.timingTxt}</Typography>
        </ButtonRow>
      </FlowCenterColumn>
      <Stack className="right-column" gap={3}>
        <Stack gap={1}>
          <Typography variant="body2" data-bold="true">
            {copy.myDecisiveLocation}
          </Typography>
          <CodeSnippet
            code={locationUrl}
            maxHeight="150px"
            copyButton={false}
          />
        </Stack>

        <Stack gap={1}>
          <Typography variant="body2" data-bold="true">
            {copy.datadogCodeBlock}
          </Typography>
          <CodeSnippet code={code} maxHeight="440px" />
        </Stack>
      </Stack>
    </>
  );
}
