import {
  DEFAULT_CONNECTION_VALIDATION_WAIT_MS,
  type ConnectionValidationScope,
  useConnectionValidationStore,
  validatorRunIdToTimestamp,
} from "@store/connectionValidationStore";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

interface UseConnectionValidationOptions {
  scope?: Partial<ConnectionValidationScope>;
  autoStart?: boolean;
  waitForNewRunMs?: number;
}

export { validatorRunIdToTimestamp };

export function useConnectionValidation({
  scope,
  autoStart = true,
  waitForNewRunMs = DEFAULT_CONNECTION_VALIDATION_WAIT_MS,
}: UseConnectionValidationOptions) {
  const connectionName = scope?.connectionName;
  const namespace = scope?.namespace;
  const currentScope =
    connectionName && namespace ? { connectionName, namespace } : null;

  const {
    connectionStatus,
    error,
    loadLatestOrCreate,
    loading,
    revalidate: runRevalidation,
    validatorRun,
  } = useConnectionValidationStore(
    useShallow(
      ({
        connectionStatus,
        error,
        loadLatestOrCreate,
        revalidate,
        status,
        validatorRun,
      }) => ({
        connectionStatus,
        error,
        loadLatestOrCreate,
        loading: status === "loading",
        revalidate,
        validatorRun,
      }),
    ),
  );

  async function revalidate() {
    if (!currentScope) return null;

    return runRevalidation({ scope: currentScope, waitForNewRunMs });
  }

  useEffect(() => {
    if (!autoStart || connectionStatus) return;
    if (!connectionName || !namespace) return;

    void loadLatestOrCreate({
      scope: { connectionName, namespace },
      waitForNewRunMs,
    });
  }, [
    autoStart,
    connectionName,
    connectionStatus,
    loadLatestOrCreate,
    namespace,
    waitForNewRunMs,
  ]);

  return {
    connectionStatus,
    error,
    loading,
    revalidate,
    validatorRunId: validatorRun?.runId,
    timestamp:
      validatorRun ? validatorRunIdToTimestamp(validatorRun.runId) : undefined,
  };
}
