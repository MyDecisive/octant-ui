import type { HealthWidgetProps } from "@app-types/components";
import { ASYNC_STATUS } from "@constants/enums";
import { useHubInstallStore } from "@store/hubInstallStore";
import { useOctantStore } from "@store/octantStore";
import { connectionStatusToHealthWidgetProps } from "@utils/connectionStatusToHealthWidgetProps";
import { formatLastRun } from "@utils/formatTimestamp";
import { useConnectionValidation } from "@utils/useConnectionValidation";
import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { VerifyConnection as copy } from "../../copy/install/VerifyConnection.copy";

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
      status: "error",
      fix: {
        label: "How to fix",
        description:
          "SmartHub could not be detected in the configured cluster. Review the installation steps and cluster configuration.",
        actions: [
          {
            text: "See Docs",
            href: "https://docs.mydecisive.ai/",
          },
        ],
      },
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

  const displayTimestamp = useMemo(() => formatLastRun(timestamp), [timestamp]);

  const healthWidgetProps = useMemo(
    () => ({
      title: copy.connection,
      timestamp: displayTimestamp,
      ...connectionStatusToHealthWidgetProps({
        loading,
        connectionStatus,
        preferLoading: true,
      }),
    }),
    [displayTimestamp, connectionStatus, loading],
  );

  const smarthubWidgetProps = useMemo(
    () => ({
      title: "SmartHub Infrastructure",
      timestamp: displayTimestamp,
      simple: true,
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
