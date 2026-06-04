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
import { MASKED_DATADOG_API_KEY, MASKED_DATADOG_URL } from "../maskedDDValues";

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
  const {
    connectionName,
    namespace,
    setState: setOctantState,
  } = useOctantStore(
    useShallow(({ connectionName, namespace, setState }) => ({
      connectionName,
      namespace,
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
      // TODO: add get ARGOCD integration when that endpoint is done.
      const [ddogResult, connection] = await Promise.all([
        dDogServiceClient.getDatadogIntegrations({}).catch(() => null),
        connectionServiceClient
          .getConnection({
            connectionName,
          })
          .catch(() => null),
      ]);

      if (ignore) return;

      if (ddogResult?.names?.includes(connectionName)) {
        setInstallAndConnectField("url", MASKED_DATADOG_URL);
        setInstallAndConnectField("apiKey", MASKED_DATADOG_API_KEY);
      }

      if (connection?.connectionData?.telemetryTypes) {
        setInstallAndConnectField("lastCompletedStep", 4);

        setInstallAndConnectField(
          "telemetryTypes",
          fromMLTTypes(connection?.connectionData.telemetryTypes),
        );
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
  }, [
    connectionName,
    namespace,
    hasRan,
    setInstallAndConnectField,
    setOctantState,
  ]);

  const redirectRoute = deriveRedirectRoute(currentPath, formState);

  if (redirectRoute) {
    navigate(redirectRoute, { replace: true });
  }

  return { loading };
}
