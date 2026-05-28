import {
  HealthWidget,
  type HealthWidgetProps,
} from "@components/HealthWidget/HealthWidget";
import { ButtonRow } from "@components/layout/ButtonRow";
import { PageContainer } from "@components/layout/PageContainer";
import { ConnectError } from "@connectrpc/connect";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import type { GetConnectionStatusResponse } from "@mydecisiveai/octant-client";
import { useOctantStore, type ValidationSnapshot } from "@store/octantStore";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { VerifyConnection as copy } from "../copy/install/VerifyConnection.copy";
import {
  connectionServiceClient,
  createOrGetValidatorRunId,
} from "../services/connection";

type ValidationStatus = Omit<ValidationSnapshot, "timestamp">;

function connectionStatusResponseToHealthWidgetProps(
  loading: boolean,
  connectionStatus: ValidationStatus | null,
): Omit<HealthWidgetProps, "title"> {
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
          fix: dataIntegrity
            ? undefined
            : {
                label: "Data integrity failed",
                description:
                  "Some telemetry does not match expected validation results.",
                actions: [
                  {
                    text: "See Docs",
                    href: "https://docs.mydecisive.ai/",
                  },
                ],
              },
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

function toValidationSnapshot(
  connectionStatus: GetConnectionStatusResponse,
): ValidationSnapshot {
  const { receivingData, sendingData, dataIntegrity, clientsConnected } =
    connectionStatus;

  return {
    receivingData,
    sendingData,
    dataIntegrity,
    clientsConnected,
    timestamp: new Date().toISOString(),
  };
}

function formatLastRun(timestamp?: string) {
  if (!timestamp) return undefined;

  return `Last run ${new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp))}`;
}

export function SystemHealthPage() {
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<ValidationStatus | null>(null);

  const [validatorRun, setValidatorRun] = useState<{
    connectionName: string;
    namespace: string;
    runId: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { connectionName, namespace, setOctantState, validation } =
    useOctantStore(
      useShallow(({ connectionName, namespace, setState, validation }) => ({
        connectionName,
        namespace,
        setOctantState: setState,
        validation,
      })),
    );

  const displayedConnectionStatus: ValidationStatus | null =
    connectionStatus ?? validation ?? null;

  const currentRunId =
    validatorRun &&
    validatorRun.connectionName === connectionName &&
    validatorRun.namespace === namespace
      ? validatorRun.runId
      : null;

  async function handleCheckConnectionStatus(validatorRunId: string | null) {
    if (!connectionName || !namespace) return;

    setLoading(true);
    setError(null);
    try {
      let id = validatorRunId ?? undefined;
      if (!id) {
        id = await createOrGetValidatorRunId({
          connectionName,
          namespace,
        });

        setValidatorRun({ connectionName, namespace, runId: id });
      }
      const connectionStatusResponse =
        await connectionServiceClient.getConnectionStatus({
          scope: { connectionName, namespace },
          validatorRunId: id,
        });
      const nextValidation = toValidationSnapshot(connectionStatusResponse);
      setConnectionStatus(nextValidation);
      setOctantState("validation", nextValidation);
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
  }

  useEffect(() => {
    let ignore = false;

    async function fetchValidatorRunId(attempt: number) {
      if (ignore || !connectionName || !namespace) return;
      if (attempt >= 3) {
        setError(
          "Something went wrong with trying to run the validator. Please try again.",
        );
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const validatorRunId = await createOrGetValidatorRunId({
          connectionName,
          namespace,
        });
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, 90_000);
        });
        if (!ignore && validatorRunId) {
          setValidatorRun({ connectionName, namespace, runId: validatorRunId });

          const connectionStatusResponse =
            await connectionServiceClient.getConnectionStatus({
              scope: { connectionName, namespace },
              validatorRunId,
            });
          if (ignore) return;

          const nextValidation = toValidationSnapshot(connectionStatusResponse);
          setConnectionStatus(nextValidation);
          setOctantState("validation", nextValidation);
        }
      } catch (e) {
        console.warn("error in fetchValidatorRunId ", e);
        if (!ignore) void fetchValidatorRunId(attempt + 1);
        else setError("Error fetching validator run Id");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void fetchValidatorRunId(0);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      ignore = true;
      if (connectionName && namespace) {
        void connectionServiceClient.deleteConnectionValidator({
          scope: {
            connectionName,
            namespace,
          },
        });
      }
    };
  }, [connectionName, namespace, setOctantState]);

  const healthWidgetProps = connectionStatusResponseToHealthWidgetProps(
    loading,
    displayedConnectionStatus,
  );
  return (
    <PageContainer>
      <Stack gap={2} alignItems={"center"}>
        <Stack gap={1}>
          <HealthWidget
            title={copy.connection}
            timestamp={formatLastRun(validation?.timestamp)}
            {...healthWidgetProps}
          />
          <ButtonRow>
            {(healthWidgetProps.status === "error" || error) && (
              <Button
                variant="contained"
                onClick={() => void handleCheckConnectionStatus(currentRunId)}
              >
                Revalidate
              </Button>
            )}
          </ButtonRow>
        </Stack>
        <HealthWidget
          title="Smarthub Infrastructure"
          timestamp={formatLastRun(validation?.timestamp)}
          simple
          {...healthWidgetProps}
        />
      </Stack>
    </PageContainer>
  );
}
