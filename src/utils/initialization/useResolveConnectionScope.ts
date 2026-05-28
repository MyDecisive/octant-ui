import { useOctantStore } from "@store/octantStore";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { connectionServiceClient } from "../../services/connection";

type ResolveStatus = "pending" | "resolved";

export function useResolveConnectionScope() {
  const { connectionName, namespace, setState } = useOctantStore(
    useShallow(({ connectionName, namespace, setState }) => ({
      connectionName,
      namespace,
      setState,
    })),
  );

  const [status, setStatus] = useState<ResolveStatus>(
    connectionName && namespace ? "resolved" : "pending",
  );

  useEffect(() => {
    // TODO: these should be verified if present instead of assuming they're legit
    if (connectionName && namespace) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("resolved");
      return;
    }

    let ignore = false;

    async function resolve() {
      try {
        const connectionsRes = await connectionServiceClient.getConnections({});
        if (ignore) return;

        if (connectionsRes.connectionNames.length > 0) {
          const fetchedConnectionName = connectionsRes.connectionNames[0];
          setState("connectionName", fetchedConnectionName);
          if (fetchedConnectionName) {
            const namedConnectionRes =
              await connectionServiceClient.getConnection({
                connectionName: fetchedConnectionName,
              });
            const fetchedNamespace =
              namedConnectionRes?.connectionData?.scope?.namespace;
            if (fetchedNamespace) {
              setState("namespace", fetchedNamespace);
            }
          }
        }
      } catch {
        // no connections found or network error — proceed without one
      } finally {
        if (!ignore) setStatus("resolved");
      }
    }

    void resolve();

    return () => {
      ignore = true;
    };
  }, [connectionName, namespace, setState]);

  return status === "pending";
}
