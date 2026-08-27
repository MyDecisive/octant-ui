import type { HealthWidgetProps } from "@app-types/components";
import { ASYNC_STATUS } from "@constants/enums";
import { useHubInstallStore } from "@store/hubInstallStore";
import { useOctantStore } from "@store/octantStore";
import { connectionStatusToHealthWidgetProps } from "@utils/connectionStatusToHealthWidgetProps";
import { useConnectionValidation } from "../../hooks/useConnectionValidation";
import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { VerifyConnection as copy } from "../../copy/install/VerifyConnection.copy";
import { lastRun } from "@copy/global";

function smarthubStatusToHealthWidgetProps(
  installed: boolean | null,
  loading: boolean,
): Omit<HealthWidgetProps, "title"> {
  if (loading) {
    return { status: "loading" };
  }

  if (installed === true) {
    return { status: "operational" };
  }

  if (installed === false) {
    return {
      fix: {
        actions: [
          {
            href: "https://docs.mydecisive.ai/",
            text: "See Docs",
          },
        ],
        description:
          "SmartHub could not be detected in the configured cluster. Review the installation steps and cluster configuration.",
        label: "How to fix",
      },
      status: "error",
    };
  }

  return {};
}

export function useManageSystemHealth() {
  const { connectionName, namespace } = useOctantStore(
    useShallow(({ connection }) => ({
      connectionName: connection?.scope?.connectionName,
      namespace: connection?.scope?.namespace,
    })),
  );
  const { hubInstalled, hubLoading, verifyInstall } = useHubInstallStore(
    useShallow(({ installed, status, verifyInstall }) => ({
      hubInstalled: installed,
      hubLoading: status === ASYNC_STATUS.LOADING,
      verifyInstall,
    })),
  );

  const {
    connectionStatus,
    loading,
    revalidate: revalidateConnection,
    timestamp,
  } = useConnectionValidation({
    scope: { connectionName, namespace },
  });

  const revalidate = useCallback(async () => {
    if (!connectionName) {
      await revalidateConnection();
      return;
    }

    await Promise.all([verifyInstall(connectionName), revalidateConnection()]);
  }, [connectionName, revalidateConnection, verifyInstall]);

  const displayTimestamp = useMemo(() => lastRun(timestamp), [timestamp]);

  const healthWidgetProps = useMemo(
    () => ({
      timestamp: displayTimestamp,
      title: copy.connection,
      ...connectionStatusToHealthWidgetProps({
        connectionStatus,
        loading,
        preferLoading: true,
      }),
    }),
    [displayTimestamp, connectionStatus, loading],
  );

  const smarthubWidgetProps = useMemo(
    () => ({
      simple: true,
      timestamp: displayTimestamp,
      title: "SmartHub Infrastructure",
      ...smarthubStatusToHealthWidgetProps(hubInstalled ?? null, hubLoading),
    }),
    [displayTimestamp, hubInstalled, hubLoading],
  );

  return useMemo(
    () => ({
      healthWidgetProps,
      revalidate,
      showRevalidateButton:
        !loading && !hubLoading && !!connectionName && !!namespace,
      smarthubWidgetProps,
    }),
    [
      healthWidgetProps,
      loading,
      hubLoading,
      connectionName,
      namespace,
      revalidate,
      smarthubWidgetProps,
    ],
  );
}
