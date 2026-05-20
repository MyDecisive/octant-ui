import { useOctantStore } from "@store/octantStore";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useShallow } from "zustand/shallow";
import { ROUTES } from "../constants/routing";
import { connectionServiceClient } from "../services/connection";
import { dDogServiceClient } from "../services/ddog";
import { waitForInstallStatus } from "../services/install";

/**
 * TODO: if no `connectionName`, it could be a user logging in to a cluster
 * that someone else set up. We should use `connectionServiceClient.getConnections`
 * to check for `connectionName`s. If there's just one, this flow can continue. If
 * there's more than one, the user should probably select one -- or do we test them
 * all?
 */

type Trinary = boolean | null;

function determineMaxAllowedRoute(
  mdaiInstalled: Trinary,
  dDogIntegrated: Trinary,
  connected: Trinary,
) {
  if (!mdaiInstalled && !dDogIntegrated && !connected) return ROUTES.SPLASH;
  if (!mdaiInstalled) return `${ROUTES.INSTALL}/3`;
  if (!dDogIntegrated || !connected) return `${ROUTES.INSTALL}/4`;

  return null;
}
export function useDetectProgress() {
  const [, navigate] = useLocation();
  const { connectionName } = useOctantStore(
    useShallow(({ connectionName }) => ({ connectionName })),
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function runChecks() {
      if (!connectionName) {
        navigate(ROUTES.SPLASH, { replace: true });
        if (!ignore) setLoading(false);
        return;
      }

      const [installResult, ddogResult, connectionsResult] = await Promise.all([
        waitForInstallStatus(connectionName),
        dDogServiceClient.getDatadogIntegrations({}).catch(() => null),
        connectionServiceClient.getConnections({}).catch(() => null),
      ]);

      if (ignore) return;

      const mdaiInstalled = installResult.status === "installed";
      const dDogIntegrated =
        ddogResult?.names?.includes(connectionName) ?? false;
      const connected =
        connectionsResult?.connectionNames?.includes(connectionName) ?? false;

      const maxAllowedRoute = determineMaxAllowedRoute(
        mdaiInstalled,
        dDogIntegrated,
        connected,
      );

      if (maxAllowedRoute) {
        navigate(maxAllowedRoute, { replace: true });
      }

      setLoading(false);
    }

    void runChecks();

    return () => {
      ignore = true;
    };
  }, [connectionName, navigate]);

  return { loading };
}
