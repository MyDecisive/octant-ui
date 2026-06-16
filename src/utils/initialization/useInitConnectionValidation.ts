import { useConnectionValidationStore } from "@store/connectionValidationStore";
import { useOctantStore } from "@store/octantStore";
import { useEffect, useRef } from "react";

export function useInitConnectionValidation(upstreamResolving: boolean) {
  const loadLatestOrCreate = useConnectionValidationStore(
    (state) => state.loadLatestOrCreate,
  );
  const connectionScope = useOctantStore(
    (state) => state.connection?.scope,
  );

  const initializedScopeKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (upstreamResolving) {
      return;
    }

    const connectionName = connectionScope?.connectionName;
    const namespace = connectionScope?.namespace;

    if (!connectionName || !namespace) {
      return;
    }

    const scopeKey = `${connectionName}:${namespace}`;
    if (initializedScopeKeyRef.current === scopeKey) {
      return;
    }
    initializedScopeKeyRef.current = scopeKey;
    const scope = { connectionName, namespace };

    async function loadValidation() {
      await loadLatestOrCreate({
        scope,
      });
    }

    void loadValidation();
  }, [connectionScope, loadLatestOrCreate, upstreamResolving]);
}
