import { useOctantStore } from "@store/octantStore";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { waitForInstallStatus } from "../../services/install";

type VerifyStatus = "pending" | "complete";

export function useVerifyHubInstall(upstreamResolving: boolean) {
  const { connectionName, setState } = useOctantStore(
    useShallow(({ connection, setState }) => ({
      connectionName: connection?.scope?.connectionName,

      setState,
    })),
  );

  const [status, setStatus] = useState<VerifyStatus>("pending");
  const hasRan = useRef(false);

  useEffect(() => {
    if (upstreamResolving || hasRan.current) {
      return;
    }
    hasRan.current = true;

    async function verifyInstall() {
      if (!connectionName) {
        setStatus("complete");
        return;
      }

      const installResult = await waitForInstallStatus(connectionName);
      setState("hubInstalled", installResult.status === "installed");
      setStatus("complete");
    }

    void verifyInstall();
  }, [connectionName, setState, upstreamResolving]);

  return status === "pending";
}
