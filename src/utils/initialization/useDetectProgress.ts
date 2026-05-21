import {
  useInstallAndConnectStore,
  type InstallAndConnectFormFields,
} from "@store/installAndConnectStore";
import { useOctantStore } from "@store/octantStore";
import { fromMLTTypes } from "@utils/fromMltTypes";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useShallow } from "zustand/shallow";
import { INSTALL_AND_CONNECT, ROUTES } from "../../constants/routing";
import { connectionServiceClient } from "../../services/connection";
import { dDogServiceClient } from "../../services/ddog";
import { waitForInstallStatus } from "../../services/install";

export function deriveRedirectRoute(
  currentPath: string,
  storeState: Partial<InstallAndConnectFormFields>,
): string | null {
  const currentPageConfig = INSTALL_AND_CONNECT.find(
    (pageConfig) => pageConfig.path === currentPath,
  );
  const restriction = currentPageConfig?.isAvailable;
  if (!restriction || restriction(storeState)) return null;

  // find the last route the user has qualified for
  const lastQualified = INSTALL_AND_CONNECT.filter((pageConfig) =>
    pageConfig.isAvailable(storeState),
  ).at(-1);

  return lastQualified?.path ?? ROUTES.SPLASH;
}

export function useDetectProgress() {
  const [currentPath, navigate] = useLocation();
  const { connectionName, setState: setOctantState } = useOctantStore(
    useShallow(({ connectionName, setState }) => ({
      connectionName,
      setState,
    })),
  );

  const formState = useInstallAndConnectStore(
    useShallow(({ connectionName, namespace, telemetryTypes, url }) => ({
      connectionName,
      namespace,
      telemetryTypes,
      url,
    })),
  );

  const setInstallAndConnectField = useInstallAndConnectStore(
    (state) => state.setFormField,
  );

  const [hasRan, setHasRan] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function runChecks() {
      if (!connectionName) {
        if (!ignore) {
          setHasRan(true);
          setLoading(false);
        }
        return;
      }

      const [installResult, ddogResult, connectionsResult] = await Promise.all([
        waitForInstallStatus(connectionName),
        dDogServiceClient.getDatadogIntegrations({}).catch(() => null),
        connectionServiceClient.getConnections({}).catch(() => null),
      ]);

      if (ignore) return;

      if (installResult.status === "installed") {
        setInstallAndConnectField("lastCompletedStep", 3);
        setOctantState("namespace", "****");
      }

      if (ddogResult?.names?.includes(connectionName)) {
        setInstallAndConnectField("url", "**** datadog url ****");
      }

      if (connectionsResult?.connectionNames?.includes(connectionName)) {
        const connection = await connectionServiceClient.getConnection({
          connectionName,
        });
        if (connection.telemetryTypes) {
          setInstallAndConnectField("lastCompletedStep", 4);

          setInstallAndConnectField(
            "telemetryTypes",
            fromMLTTypes(connection.telemetryTypes),
          );
        }
      }
      setHasRan(true);
      setLoading(false);
    }

    if (!hasRan) {
      void runChecks();
    }

    return () => {
      ignore = true;
    };
  }, [connectionName, hasRan, setInstallAndConnectField, setOctantState]);

  const redirectRoute = deriveRedirectRoute(currentPath, formState);

  if (redirectRoute) {
    navigate(redirectRoute, { replace: true });
  }

  return { loading };
}
