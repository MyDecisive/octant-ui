import { InstallStatus } from "@mydecisiveai/octant-client";
import { useOctantStore } from "@store/octantStore";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { ROUTES } from "../constants/routing";
import { connectionServiceClient } from "../services/connection";
import { dDogServiceClient } from "../services/ddog";
import { installServiceClient } from "../services/install";

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
  const { connectionName } = useOctantStore(
    useShallow(({ connectionName }) => ({
      connectionName,
    })),
  );

  const initialState = connectionName ? null : false;
  const [mdaiInstalled, setMdaiInstalled] = useState<Trinary>(initialState);
  const [dDogIntegrated, setDDogIntegrated] = useState<Trinary>(initialState);
  const [connected, setConnected] = useState<Trinary>(initialState);

  // TODO: Get Argo Connections

  useEffect(() => {
    let ignore = false;
    let timeoutId: number | null = null;

    async function getInstallStatus() {
      if (!connectionName) {
        if (!ignore) {
          setMdaiInstalled(false);
        }
        return;
      }
      try {
        for await (const res of installServiceClient.getInstallStatus({
          connectionName,
        })) {
          switch (res.installStatus) {
            case InstallStatus.INSTALLED:
              if (!ignore) {
                setMdaiInstalled(true);
              }
              return;
            case InstallStatus.TIMEOUT:
              timeoutId = setTimeout(() => {
                void getInstallStatus();
              }, 10_000);
              break;
            default:
              continue;
          }
        }

        if (!ignore) {
          setMdaiInstalled(false);
        }
      } catch {
        setMdaiInstalled(false);
      }
    }

    if (mdaiInstalled === null) {
      void getInstallStatus();
    }

    return () => {
      ignore = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [connectionName, mdaiInstalled]);

  useEffect(() => {
    let ignore = false;

    async function getDDogAndConnections() {
      if (!connectionName) {
        if (!ignore) {
          setDDogIntegrated(false);
          setConnected(false);
        }
        return;
      }
      await Promise.all([
        dDogServiceClient
          .getDatadogIntegrations({})
          .then((res) => {
            if (res?.names && !ignore) {
              setDDogIntegrated(res.names.includes(connectionName));
            }
          })
          .catch(() => {
            if (!ignore) {
              setDDogIntegrated(false);
            }
          }),
        connectionServiceClient
          .getConnections({})
          .then((res) => {
            if (res?.connectionNames && !ignore) {
              setConnected(res.connectionNames.includes(connectionName));
            }
          })
          .catch(() => {
            if (!ignore) {
              setConnected(false);
            }
          }),
      ]);
    }

    if (dDogIntegrated === null || connected === null) {
      void getDDogAndConnections();
    }

    return () => {
      ignore = true;
    };
  }, [dDogIntegrated, connected, connectionName]);

  const loading =
    dDogIntegrated === null || mdaiInstalled === null || connected === null;

  const maxAllowedRoute = determineMaxAllowedRoute(
    mdaiInstalled,
    dDogIntegrated,
    connected,
  );

  return { loading, maxAllowedRoute };
}
