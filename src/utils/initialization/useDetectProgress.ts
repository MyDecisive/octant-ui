import {
  useInstallAndConnectStore,
  type InstallAndConnectFormFields,
} from "@store/installAndConnectStore";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useShallow } from "zustand/shallow";
import { SECRET_VALUE_MASK } from "../../constants/forms";
import { INSTALL_AND_CONNECT, ROUTES } from "../../constants/routing";
import { argoCdServiceClient } from "../../services/argoCd";
import { dDogServiceClient } from "../../services/ddog";

export function deriveRedirectRoute(
  currentPath: string,
  storeState: Partial<InstallAndConnectFormFields>,
): string | null {
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

  const { connectionName, namespace, telemetryTypes, url, lastCompletedStep } =
    useInstallAndConnectStore(
      useShallow(
        ({
          connectionName,
          namespace,
          telemetryTypes,
          lastCompletedStep,
          url,
        }) => ({
          connectionName,
          namespace,
          lastCompletedStep,
          telemetryTypes,
          url,
        }),
      ),
    );

  const setInstallAndConnectField = useInstallAndConnectStore(
    (state) => state.setFormField,
  );

  const [hasRan, setHasRan] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function runChecks() {
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
        connectionName
          ? dDogServiceClient
              .getDatadogIntegrations({})
              .then((res) =>
                res?.names?.includes(connectionName)
                  ? dDogServiceClient.getDatadogIntegrationByName({
                      name: connectionName,
                    })
                  : null,
              )
              .catch(() => null)
          : Promise.resolve(null),
      ]);

      if (ignore) return;

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

      setHasRan(true);
      setLoading(false);
    }

    if (!hasRan) {
      void runChecks();
    }

    return () => {
      ignore = true;
    };
  }, [connectionName, hasRan, setInstallAndConnectField, lastCompletedStep]);

  const redirectRoute = deriveRedirectRoute(currentPath, {
    connectionName,
    namespace,
    telemetryTypes,
    url,
  });

  if (redirectRoute) {
    navigate(redirectRoute, { replace: true });
  }

  return { loading };
}
