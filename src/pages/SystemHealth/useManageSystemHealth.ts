import type { HealthWidgetProps } from "@components/HealthWidget/HealthWidget";
import { useOctantStore } from "@store/octantStore";
import { connectionStatusToHealthWidgetProps } from "@utils/connectionStatusToHealthWidgetProps";
import { useConnectionValidation } from "@utils/useConnectionValidation";
import { useShallow } from "zustand/shallow";
import { VerifyConnection as copy } from "../../copy/install/VerifyConnection.copy";

function smarthubStatusToHealthWidgetProps(
  installed: boolean | null,
): Omit<HealthWidgetProps, "title"> {
  if (installed === true) {
    return { status: "operational" };
  }

  if (installed === false) {
    return {
      status: "error",
      fix: {
        label: "How to fix",
        description:
          "Smarthub could not be detected in the configured cluster. Review the installation steps and cluster configuration.",
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

function formatLastRun(timestamp?: string) {
  if (!timestamp) return undefined;

  return `Last run ${new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp))}`;
}

export function useManageSystemHealth() {
  const { connectionName, hubInstalled, namespace } = useOctantStore(
    useShallow(({ hubInstalled, connection }) => ({
      hubInstalled,
      connectionName: connection?.scope?.connectionName,
      namespace: connection?.scope?.namespace,
    })),
  );

  const {
    connectionStatus,
    error,
    loading,
    revalidate,
    timestamp,
  } = useConnectionValidation({
    scope: { connectionName, namespace },
  });

  const displayTimestamp = formatLastRun(timestamp);

  const healthWidgetProps = {
    title: copy.connection,
    timestamp: displayTimestamp,
    ...connectionStatusToHealthWidgetProps({
      loading,
      connectionStatus,
      preferLoading: true,
    }),
  };

  const smarthubWidgetProps = {
    title: "Smarthub Infrastructure",
    timestamp: displayTimestamp,
    simple: true,
    ...smarthubStatusToHealthWidgetProps(hubInstalled ?? null),
  };

  return {
    healthWidgetProps,
    revalidate,
    showRevalidateButton:
      !loading && (healthWidgetProps.status === "error" || !!error),
    smarthubWidgetProps,
  };
}
