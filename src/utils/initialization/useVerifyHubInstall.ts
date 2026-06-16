import { useOctantStore } from "@store/octantStore";
import { useHubInstallStore } from "@store/hubInstallStore";
import { useEffect, useRef, useState } from "react";

type VerifyStatus = "pending" | "complete";

export function useVerifyHubInstall(upstreamResolving: boolean) {
  const connectionName = useOctantStore(
    (state) => state.connection?.scope?.connectionName,
  );
  const verifyHubInstall = useHubInstallStore((state) => state.verifyInstall);

  const [status, setStatus] = useState<VerifyStatus>("pending");
  const hasRan = useRef(false);

  useEffect(() => {
    if (upstreamResolving || hasRan.current) {
      return;
    }
    hasRan.current = true;

    async function runVerification() {
      if (!connectionName) {
        setStatus("complete");
        return;
      }

      await verifyHubInstall(connectionName);
      setStatus("complete");
    }

    void runVerification();
  }, [connectionName, upstreamResolving, verifyHubInstall]);

  return status === "pending";
}
