import { useOctantStore } from "@store/octantStore";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { waitForInstallStatus } from "../../services/install";

type VerifyStatus = "pending" | "complete";

export function useVerifyHubInstall(upstreamResolving: boolean) {
  const { connectionName, setState } = useOctantStore(
    useShallow(({ connectionName, setState }) => ({
      connectionName,

      setState,
    })),
  );

  const [status, setStatus] = useState<VerifyStatus>("pending");
  const [hasRan, setHasRan] = useState(false);

  useEffect(() => {
    let ignore = false;
    if (upstreamResolving) {
      return;
    }

    async function verifyInstall() {
      if (!connectionName) {
        if (!ignore) {
          setHasRan(true);
          setStatus("complete");
        }
        return;
      }

      const installResult = await waitForInstallStatus(connectionName);

      if (ignore) return;

      setState("hubInstalled", installResult.status === "installed");
      setStatus("complete");
    }

    if (!hasRan) {
      void verifyInstall();
    }

    return () => {
      ignore = true;
    };
  }, [connectionName, hasRan, setState, upstreamResolving]);

  return status === "pending";
}
