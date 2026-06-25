import type { UIConnectionScope } from "@app-types/contracts";
import {
  DEFAULT_CONNECTION_VALIDATION_WAIT_MS,
  selectConnectionValidationView,
  useConnectionValidationStore,
} from "@store/connectionValidationStore";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

interface UseConnectionValidationOptions {
  scope?: Partial<UIConnectionScope>;
  autoStart?: boolean;
  waitForNewRunMs?: number;
}

export function useConnectionValidation({
  scope,
  autoStart = false,
  waitForNewRunMs = DEFAULT_CONNECTION_VALIDATION_WAIT_MS,
}: UseConnectionValidationOptions) {
  const connectionName = scope?.connectionName;
  const namespace = scope?.namespace;
  const currentScope =
    connectionName && namespace ? { connectionName, namespace } : null;

  const {
    connectionStatus,
    loadLatestOrCreate,
    revalidate: runRevalidation,
    ...validationView
  } = useConnectionValidationStore(useShallow(selectConnectionValidationView));

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
    ...validationView,
    revalidate,
  };
}
