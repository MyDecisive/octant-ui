import { useOctantStore } from "@store/octantStore";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { connectionServiceClient } from "../../services/connection";

type ResolveStatus = "pending" | "resolved";

export function useResolveConnectionName() {
  const { connectionName, setState } = useOctantStore(
    useShallow(({ connectionName, setState }) => ({
      connectionName,
      setState,
    })),
  );

  const [status, setStatus] = useState<ResolveStatus>(
    connectionName ? "resolved" : "pending",
  );

  useEffect(() => {
    if (connectionName) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("resolved");
      return;
    }

    let ignore = false;

    async function resolve() {
      try {
        const res = await connectionServiceClient.getConnections({});
        if (ignore) return;

        if (res.connectionNames.length > 0) {
          setState("connectionName", res.connectionNames[0]);
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
  }, [connectionName, setState]);

  return { resolving: status === "pending" };
}
