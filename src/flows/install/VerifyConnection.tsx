import {
  HealthWidget,
  type HealthWidgetProps,
} from "@components/HealthWidget/HealthWidget";
import { ButtonRow } from "@components/layout/ButtonRow";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { NextButton } from "@components/NextButton";
import { ViewTitle } from "@components/ViewTitle";
import { Typography } from "@mui/material";
import type { GetConnectionStatusResponse } from "@mydecisiveai/octant-client";
import { useConnectStore } from "@store/connectStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { connectionServiceClient } from "../../services/connection";

function connectionStatusResponseToHealthWidgetProps(
  loading: boolean,
  connectionStatus: GetConnectionStatusResponse | null,
): Omit<HealthWidgetProps, "title"> {
  if (connectionStatus) {
    const { receivingData, sendingData, dataIntegrity, clientsConnected } =
      connectionStatus;

    const status =
      receivingData && sendingData && dataIntegrity && clientsConnected
        ? "operational"
        : "error";

    return {
      status,
      facets: [
        {
          label: "Clients connected",
          health: clientsConnected,
        },
        {
          label: "Receiving data",
          health: receivingData,
        },
        {
          label: "Sending data",
          health: sendingData,
        },
        {
          label: "Data integrity",
          health: dataIntegrity,
        },
      ],
    };
  }

  if (loading)
    return {
      status: "loading",
      facets: [
        {
          label: "Clients connected",
          loading: true,
        },
        {
          label: "Receiving data",
          loading: true,
        },
        {
          label: "Sending data",
          loading: true,
        },
        {
          label: "Data integrity",
          loading: true,
        },
      ],
    };

  return {
    status: "loading",
  };
}

export function VerifyConnection() {
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<GetConnectionStatusResponse | null>(null);

  const timeoutRef = useRef<number | null>(null);

  const { connectionName, namespace } = useConnectStore(
    useShallow((state) => ({
      connectionName: state.form.connectionName,
      namespace: state.form.namespace,
    })),
  );

  const handleCheckConnectionStatus = useCallback(async () => {
    setLoading(true);
    try {
      const { validatorRunId } =
        await connectionServiceClient.createConnectionValidatorRun({
          scope: { connectionName, namespace },
        });
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, 60_000);
      });
      const connectionStatusResponse =
        await connectionServiceClient.getConnectionStatus({
          scope: { connectionName, namespace },
          validatorRunId,
        });
      setConnectionStatus(connectionStatusResponse);
    } catch (e: unknown) {
      console.error(e instanceof Error ? e.message : e);
    } finally {
      setLoading(false);
    }
  }, [connectionName, namespace]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void handleCheckConnectionStatus();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [handleCheckConnectionStatus]);

  const healthWidgetProps = connectionStatusResponseToHealthWidgetProps(
    loading,
    connectionStatus,
  );
  return (
    <FlowCenterColumn>
      <ViewTitle title="Verify Datadog connection and test data flow" />
      <HealthWidget title="Datadog connection" {...healthWidgetProps} />
      <ButtonRow>
        <NextButton disabled={connectionStatus !== null} />
        <Typography variant="chipLabel">
          This process will take about 5 minutes.
        </Typography>
      </ButtonRow>
    </FlowCenterColumn>
  );
}
