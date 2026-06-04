import { ConnectError } from "@connectrpc/connect";
import { useOctantStore } from "@store/octantStore";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { connectionServiceClient } from "../../services/connection";

type ResolveStatus = "pending" | "resolved";

const NO_CONNECTIONS_ERROR =
  '[internal] failed to get connections: failed to get configmap mdai-octant-connections: configmaps "mdai-octant-connections" not found';

export function useResolveConnection() {
  const { setState } = useOctantStore(
    useShallow(({ setState }) => ({
      setState,
    })),
  );

  const [status, setStatus] = useState<ResolveStatus>("pending");
  const hasRan = useRef(false);

  useEffect(() => {
    if (hasRan.current) return;
    hasRan.current = true;

    async function resolve() {
      try {
        const connectionsRes = await connectionServiceClient.getConnections({});
        if (connectionsRes.connectionNames.length > 0) {
          const fetchedConnectionName = connectionsRes.connectionNames[0];

          if (fetchedConnectionName) {
            const namedConnectionRes =
              await connectionServiceClient.getConnection({
                connectionName: fetchedConnectionName,
              });

            setState("connection", namedConnectionRes.connectionData);
          }
        }
      } catch (e) {
        // no connections found or network error — proceed without one
        console.error("Error resolving connection: ", e);
        if (e instanceof ConnectError) {
          if (e.message !== NO_CONNECTIONS_ERROR) {
            throw e;
          }
        }
      } finally {
        setStatus("resolved");
      }
    }

    if (status === "pending") {
      void resolve();
    }
  }, [status, setState]);

  return status === "pending";
}
