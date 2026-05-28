import { ConnectError } from "@connectrpc/connect";
import {
  InstallStatus,
  type GetConnectionStatusResponse,
} from "@mydecisiveai/octant-client";
import { type ValidationSnapshot, useOctantStore } from "@store/octantStore";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import {
  connectionServiceClient,
  createOrGetValidatorRunId,
} from "../../services/connection";
import { installServiceClient } from "../../services/install";

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

export function useManageSystemHealth() {
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<ValidationStatus | null>(null);
  const [smarthubInstalled, setSmarthubInstalled] = useState<boolean | null>(
    null,
  );
  const [smarthubLoading, setSmarthubLoading] = useState(false);

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

  const connectionStatusWithFallback: ValidationStatus | null =
    connectionStatus ?? validation ?? null;

  const currentRunId =
    validatorRun &&
    validatorRun.connectionName === connectionName &&
    validatorRun.namespace === namespace
      ? validatorRun.runId
      : null;

  async function revalidate() {
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

  useEffect(() => {
    let ignore = false;

    async function fetchSmarthubStatus() {
      await Promise.resolve();
      if (ignore || !connectionName) return;

      setSmarthubLoading(true);
      try {
        for await (const res of installServiceClient.getInstallStatus({
          connectionName,
        })) {
          if (ignore) return;

          switch (res.installStatus) {
            case InstallStatus.INSTALLED:
              setSmarthubInstalled(true);
              return;
            case InstallStatus.ERROR:
            case InstallStatus.TIMEOUT:
              setSmarthubInstalled(false);
              return;
            default:
              continue;
          }
        }

        if (!ignore) {
          setSmarthubInstalled(false);
        }
      } catch (e) {
        console.warn("error in fetchSmarthubStatus ", e);
        if (!ignore) {
          setSmarthubInstalled(false);
        }
      } finally {
        if (!ignore) {
          setSmarthubLoading(false);
        }
      }
    }

    void fetchSmarthubStatus();

    return () => {
      ignore = true;
    };
  }, [connectionName]);

  return {
    connectionStatus: connectionStatusWithFallback,
    error,
    loading,
    revalidate,
    smarthubInstalled,
    smarthubLoading,
    validation,
  };
}
