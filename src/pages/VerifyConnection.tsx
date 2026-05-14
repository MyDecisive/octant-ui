import {
  HealthWidget,
  type HealthWidgetProps,
} from "@components/HealthWidget/HealthWidget";
import { ButtonRow } from "@components/layout/ButtonRow";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { NextButton } from "@components/NextButton";
import { ViewTitle } from "@components/ViewTitle";
import { ConnectError } from "@connectrpc/connect";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { GetConnectionStatusResponse } from "@mydecisiveai/octant-client";
import { useInstallAndConnectStore } from "@store/installAndConnectStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { VerifyConnection as copy } from "../copy/install/VerifyConnection.copy";
import {
  connectionServiceClient,
  createOrGetValidatorRunId,
} from "../services/connection";

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
  if (loading) {
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
  }

  return {
    facets: [
      {
        label: "Clients connected",
      },
      {
        label: "Receiving data",
      },
      {
        label: "Sending data",
      },
      {
        label: "Data integrity",
      },
    ],
  };
}

export function VerifyConnection() {
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<GetConnectionStatusResponse | null>(null);

  const [runId, setRunId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const timeoutRef = useRef<number | null>(null);

  const { connectionName, namespace } = useInstallAndConnectStore(
    useShallow(({ connectionName, namespace }) => ({
      connectionName,
      namespace,
    })),
  );

  const handleCheckConnectionStatus = useCallback(
    async (validatorRunId: string | null) => {
      setLoading(true);
      try {
        let id: string | undefined;
        if (!validatorRunId) {
          id = await createOrGetValidatorRunId({
            connectionName: connectionName!,
            namespace: namespace,
          });

          setRunId(id);
        }
        const connectionStatusResponse =
          await connectionServiceClient.getConnectionStatus({
            scope: { connectionName, namespace },
            validatorRunId: validatorRunId ?? id,
          });
        setConnectionStatus(connectionStatusResponse);
      } catch (e: unknown) {
        console.error(e instanceof Error ? e.message : e);
        if (e instanceof Error || e instanceof ConnectError) {
          setError(e.message);
        } else {
          setError("Something went wrong while checking connection status");
        }
      } finally {
        setLoading(false);
      }
    },
    [connectionName, namespace],
  );

  useEffect(() => {
    let ignore = false;

    async function fetchValidatorRunId(attempt: number) {
      if (ignore) return;
      if (attempt >= 3) {
        // TODO: better error message?
        setError("Something went wrong with trying to spin up a validator");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const validatorRunId = await createOrGetValidatorRunId({
          connectionName: connectionName!,
          namespace: namespace,
        });
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, 90_000);
        });
        if (!ignore && validatorRunId) {
          setRunId(validatorRunId);

          void handleCheckConnectionStatus(validatorRunId);
          ignore = true;
        }
      } catch (e) {
        console.warn("error in fetchValidatorRunId ", e);
        if (!ignore) void fetchValidatorRunId(attempt + 1);
        else setError("Error fetching validator run Id");
      } finally {
        setLoading(false);
      }
    }

    if (!runId) {
      void fetchValidatorRunId(0);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      ignore = true;
      void connectionServiceClient.deleteConnectionValidator({
        scope: {
          connectionName: connectionName!,
          namespace: namespace,
        },
      });
    };
  }, [connectionName, namespace, handleCheckConnectionStatus, runId]);

  const healthWidgetProps = connectionStatusResponseToHealthWidgetProps(
    loading,
    connectionStatus,
  );

  return (
    <FlowCenterColumn>
      <ViewTitle title={copy.header} />
      <HealthWidget title={copy.connection} {...healthWidgetProps} />
      <ButtonRow>
        <NextButton disabled={connectionStatus === null} />
        {(healthWidgetProps.status === "error" || error) && (
          <Button onClick={() => void handleCheckConnectionStatus(runId)}>
            Try again
          </Button>
        )}
        <Typography variant="chipLabel">
          This process will take about 5 minutes.
        </Typography>
      </ButtonRow>
    </FlowCenterColumn>
  );
}
