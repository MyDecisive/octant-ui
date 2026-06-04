import { ConnectError } from "@connectrpc/connect";
import { useOctantStore } from "@store/octantStore";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { connectionServiceClient } from "../../services/connection";

type ResolveStatus = "pending" | "resolved";

const NO_CONNECTIONS_ERROR =
  '[internal] failed to get connections: failed to get configmap mdai-octant-connections: configmaps "mdai-octant-connections" not found';

export function useResolveConnectionScope() {
  const { connectionName, namespace, setState } = useOctantStore(
    useShallow(({ connectionName, namespace, setState }) => ({
      connectionName,
      namespace,
      setState,
    })),
  );

  const [hasRan, setHasRan] = useState(false);
  const [status, setStatus] = useState<ResolveStatus>("pending");

  useEffect(() => {
    // TODO: these should be verified if present instead of assuming they're legit
    if (!hasRan && connectionName && namespace) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("resolved");
      setHasRan(true);
      return;
    }

    let ignore = false;

    async function resolve() {
      try {
        if (connectionName) {
          const existingConnectionRes =
            await connectionServiceClient.getConnection({
              connectionName,
            });

          if (ignore) return;

          const existingNamespace =
            existingConnectionRes.connectionData?.scope?.namespace;

          if (existingNamespace) {
            setState("namespace", existingNamespace);
            setHasRan(true);
            setStatus("resolved");
            return;
          }
        }

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
      } catch (e) {
        // no connections found or network error — proceed without one
        if (e instanceof ConnectError) {
          if (e.message !== NO_CONNECTIONS_ERROR) {
            throw e;
          }
        }
      } finally {
        if (!ignore) {
          setStatus("resolved");
          setHasRan(true);
        }
      }
    }

    if (!hasRan) {
      void resolve();
    }

    return () => {
      ignore = true;
    };
  }, [connectionName, hasRan, namespace, setState]);

  return status === "pending";
}
