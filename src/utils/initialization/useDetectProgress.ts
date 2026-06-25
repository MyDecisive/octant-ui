import { SECRET_VALUE_MASK } from "@constants/forms";
import { INSTALL_AND_CONNECT, ROUTES } from "@constants/routing";
import { argoCdServiceClient } from "@services/argoCd";
import { dDogServiceClient } from "@services/ddog";
import {
  useInstallAndConnectStore,
  type InstallAndConnectFormFields,
} from "@store/installAndConnectStore";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useShallow } from "zustand/shallow";

function probablyFinishedInstallAndConnect(
  state: Partial<InstallAndConnectFormFields>,
): boolean {
  return !!(
    state.connectionName &&
    state.namespace &&
    state.telemetryTypes?.length &&
    state.url &&
    state.argoUrl
  );
}

function deriveRedirectRoute(
  currentPath: string,
  storeState: Partial<InstallAndConnectFormFields>,
): string | null {
  if (
    currentPath === ROUTES.SPLASH &&
    probablyFinishedInstallAndConnect(storeState)
  ) {
    return ROUTES.CLARITY;
  }
  const currentPageConfig = INSTALL_AND_CONNECT.find(
    (pageConfig) => pageConfig.path === currentPath,
  );
  const restriction = currentPageConfig?.isAvailable;
  if (!restriction || restriction(storeState)) return null;

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
    telemetryTypes,
    url,
    argoUrl,
    lastCompletedStep,
  } = useInstallAndConnectStore(
    useShallow(
      ({
        connectionName,
        namespace,
        telemetryTypes,
        lastCompletedStep,
        url,
        argoUrl,
      }) => ({
        connectionName,
        namespace,
        lastCompletedStep,
        telemetryTypes,
        url,
        argoUrl,
      }),
    ),
  );

  const setInstallAndConnectField = useInstallAndConnectStore(
    (state) => state.setFormField,
  );

  const hasRan = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasRan.current) {
      return;
    }
    hasRan.current = true;

    async function runChecks() {
      if (!connectionName) {
        setLoading(false);
        return;
      }

      // TODO: [Progress] run connectionStatus to verify step 6?
      const [argoCdIntegration, ddogIntegration] = await Promise.all([
        argoCdServiceClient
          .getArgoIntegrations({})
          .then((res) => {
            const fetchedConnectionName = connectionName ?? res.names[0];
            if (!fetchedConnectionName) return null;

            return argoCdServiceClient.getArgoIntegrationByName({
              name: fetchedConnectionName,
            });
          })
          .catch(() => null),
        dDogServiceClient
          .getDatadogIntegrations({})
          .then((res) =>
            res?.names?.includes(connectionName)
              ? dDogServiceClient.getDatadogIntegrationByName({
                  name: connectionName,
                })
              : null,
          )
          .catch(() => null),
      ]);

      if (argoCdIntegration) {
        const { argoEndpoint } = argoCdIntegration;
        setInstallAndConnectField("argoUrl", argoEndpoint);
        setInstallAndConnectField("accountToken", SECRET_VALUE_MASK);
        if (!lastCompletedStep) {
          setInstallAndConnectField("lastCompletedStep", 2);
        }
      }

      if (ddogIntegration) {
        setInstallAndConnectField("url", ddogIntegration.url);
        setInstallAndConnectField("apiKey", SECRET_VALUE_MASK);
        setInstallAndConnectField("lastCompletedStep", 4);
      }

      setLoading(false);
    }

    void runChecks();
  }, [connectionName, setInstallAndConnectField, lastCompletedStep]);

  const redirectRoute = deriveRedirectRoute(currentPath, {
    connectionName,
    namespace,
    telemetryTypes,
    url,
    argoUrl,
  });

  if (redirectRoute) {
    navigate(redirectRoute, { replace: true });
  }

  return { loading };
}
