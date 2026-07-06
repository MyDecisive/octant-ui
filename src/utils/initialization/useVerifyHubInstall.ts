import { useOctantStore } from "@store/octantStore";
import { useHubInstallStore } from "@store/hubInstallStore";
import { useEffect, useRef, useState } from "react";
import type { AsyncStatus } from "@app-types/enums";
import { ASYNC_STATUS } from "@constants/enums";

export function useVerifyHubInstall(upstreamResolving: boolean) {
  const connectionName = useOctantStore(
    (state) => state.connection?.scope?.connectionName,
  );
  const verifyHubInstall = useHubInstallStore((state) => state.verifyInstall);

  const [status, setStatus] = useState<AsyncStatus>(ASYNC_STATUS.LOADING);
  const hasRan = useRef(false);

  useEffect(() => {
    if (upstreamResolving || hasRan.current) {
      return;
    }
    hasRan.current = true;

    async function runVerification() {
      if (!connectionName) {
        setStatus(ASYNC_STATUS.SUCCESS);
        return;
      }

      await verifyHubInstall(connectionName);
      setStatus(ASYNC_STATUS.SUCCESS);
    }

    void runVerification();
  }, [connectionName, upstreamResolving, verifyHubInstall]);

  return status === ASYNC_STATUS.LOADING;
}
