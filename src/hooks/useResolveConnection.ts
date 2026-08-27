import { ConnectError } from "@connectrpc/connect";
import { useOctantStore } from "@store/octantStore";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { connectionServiceClient } from "@services/connection";
import type { AsyncStatus } from "@app-types/enums";
import { ASYNC_STATUS } from "@constants/enums";

const NO_CONNECTIONS_ERROR_PART =
  "[internal] failed to get connections: failed to get configmap";

export function useResolveConnection() {
  const { setState } = useOctantStore(
    useShallow(({ setState }) => ({
      setState,
    })),
  );

  const [status, setStatus] = useState<AsyncStatus>(ASYNC_STATUS.LOADING);
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
        if (e instanceof ConnectError) {
          if (!e.message.includes(NO_CONNECTIONS_ERROR_PART)) {
            console.error("Error resolving connection: ", e);
            throw e;
          }
        }
      } finally {
        setStatus(ASYNC_STATUS.SUCCESS);
      }
    }

    void resolve();
  }, [setState]);

  return status === ASYNC_STATUS.LOADING;
}
