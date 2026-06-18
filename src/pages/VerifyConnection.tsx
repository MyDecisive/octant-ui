import { HealthWidget } from "@components/HealthWidget/HealthWidget";
import { ButtonRow } from "@components/layout/ButtonRow";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { NextButton } from "@components/NextButton";
import { ViewTitle } from "@components/ViewTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useInstallAndConnectStore } from "@store/installAndConnectStore";
import { connectionStatusToHealthWidgetProps } from "@utils/connectionStatusToHealthWidgetProps";
import { useConnectionValidation } from "@utils/useConnectionValidation";
import { useShallow } from "zustand/shallow";
import { VerifyConnection as copy } from "../copy/install/VerifyConnection.copy";

export function VerifyConnection() {
  const { connectionName, namespace } = useInstallAndConnectStore(
    useShallow(({ connectionName, namespace }) => ({
      connectionName,
      namespace,
    })),
  );

  const { connectionStatus, error, loading, revalidate } =
    useConnectionValidation({
      autoStart: true,
      scope: { connectionName, namespace },
    });

  const healthWidgetProps = connectionStatusToHealthWidgetProps({
    loading,
    connectionStatus,
    preferLoading: true,
  });

  return (
    <FlowCenterColumn>
      <ViewTitle title={copy.header} />
      <HealthWidget title={copy.connection} {...healthWidgetProps} />
      <ButtonRow>
        <NextButton disabled={connectionStatus === null} />
        {(healthWidgetProps.status === "error" || error) && (
          <Button onClick={() => void revalidate()}>Try again</Button>
        )}
        <Typography variant="chipLabel">
          This process will take about 5 minutes.
        </Typography>
      </ButtonRow>
    </FlowCenterColumn>
  );
}
