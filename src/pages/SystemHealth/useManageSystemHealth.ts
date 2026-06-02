import type { HealthWidgetProps } from "@components/HealthWidget/HealthWidget";
import { ConnectError } from "@connectrpc/connect";
import type { GetConnectionStatusResponse } from "@mydecisiveai/octant-client";
import { type ValidationSnapshot, useOctantStore } from "@store/octantStore";
import { connectionStatusToHealthWidgetProps } from "@utils/connectionStatusToHealthWidgetProps";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { VerifyConnection as copy } from "../../copy/install/VerifyConnection.copy";
import {
  connectionServiceClient,
  createOrGetValidatorRunId,
} from "../../services/connection";

export type ValidationStatus = Omit<ValidationSnapshot, "timestamp">;

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

function smarthubStatusToHealthWidgetProps(
  installed: boolean | null,
): Omit<HealthWidgetProps, "title"> {
  if (installed === true) {
    return { status: "operational" };
  }

  if (installed === false) {
    return {
      status: "error",
      fix: {
        label: "How to fix",
        description:
          "Smarthub could not be detected in the configured cluster. Review the installation steps and cluster configuration.",
        actions: [
          {
            text: "See Docs",
            href: "https://docs.mydecisive.ai/",
          },
        ],
      },
    };
  }

  return {};
}

function formatLastRun(timestamp?: string) {
  if (!timestamp) return undefined;

  return `Last run ${new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp))}`;
}

export function useManageSystemHealth() {
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

  const {
    connectionName,
    hubInstalled,
    namespace,
    setOctantState,
    validation,
  } = useOctantStore(
    useShallow(({ hubInstalled, connection, setState, validation }) => ({
      hubInstalled,
      connectionName: connection?.scope?.connectionName,
      namespace: connection?.scope?.namespace,
      setOctantState: setState,
      validation,
    })),
  );

  const connectionStatusWithFallback: ValidationStatus | null =
    connectionStatus ?? validation ?? null;

  const timestamp = useMemo(
    () => formatLastRun(validation?.timestamp),
    [validation?.timestamp],
  );

  const currentRunId = useMemo(
    () =>
      validatorRun &&
      validatorRun.connectionName === connectionName &&
      validatorRun.namespace === namespace
        ? validatorRun.runId
        : null,
    [connectionName, namespace, validatorRun],
  );

  const revalidate = useCallback(async () => {
    if (!connectionName || !namespace) return;

    setLoading(true);
    setError(null);
    try {
      let id = currentRunId ?? undefined;
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
  }, [connectionName, currentRunId, namespace, setOctantState]);

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

  const healthWidgetProps = useMemo(
    () => ({
      title: copy.connection,
      timestamp,
      ...connectionStatusToHealthWidgetProps({
        loading,
        connectionStatus: connectionStatusWithFallback,
        preferLoading: true,
      }),
    }),
    [connectionStatusWithFallback, loading, timestamp],
  );

  const smarthubWidgetProps = useMemo(
    () => ({
      title: "Smarthub Infrastructure",
      timestamp,
      simple: true,
      ...smarthubStatusToHealthWidgetProps(hubInstalled ?? null),
    }),
    [hubInstalled, timestamp],
  );

  return useMemo(
    () => ({
      healthWidgetProps,
      revalidate,
      showRevalidateButton:
        !loading && (healthWidgetProps.status === "error" || !!error),
      smarthubWidgetProps,
    }),
    [error, healthWidgetProps, loading, revalidate, smarthubWidgetProps],
  );
}
