import type { HealthWidgetProps } from "@app-types/components";

interface ConnectionHealthStatus {
  clientsConnected: boolean;
  receivingData: boolean;
  sendingData: boolean;
  dataIntegrity: boolean;
}

interface ConnectionStatusToHealthWidgetPropsOptions {
  loading: boolean;
  connectionStatus: ConnectionHealthStatus | null;
  preferLoading?: boolean;
}

const unloadedFacets = [
  {
    label: "Clients connected",
  },
  {
    label: "Receiving data",
  },
  {
    label: "Sending data",
  },
  {
    label: "Data integrity",
  },
];

const loadingFacets = unloadedFacets.map(({ label }) => ({
  label,
  loading: true,
}));

const dataIntegrityFix = {
  label: "Data integrity failed",
  description: "Some telemetry does not match expected validation results.",
  actions: [
    {
      text: "See Docs",
      href: "https://docs.mydecisive.ai/",
    },
  ],
};

export function connectionStatusToHealthWidgetProps({
  loading,
  connectionStatus,
  preferLoading,
}: ConnectionStatusToHealthWidgetPropsOptions): Omit<
  HealthWidgetProps,
  "title"
> {
  if (loading && (preferLoading || !connectionStatus)) {
    return {
      status: "loading",
      facets: loadingFacets,
    };
  }

  if (connectionStatus) {
    const { receivingData, sendingData, dataIntegrity, clientsConnected } =
      connectionStatus;

    const status =
      receivingData && sendingData && dataIntegrity && clientsConnected
        ? "operational"
        : "error";

    return {
      status,
      facets: [
        {
          label: "Clients connected",
          health: clientsConnected,
        },
        {
          label: "Receiving data",
          health: receivingData,
        },
        {
          label: "Sending data",
          health: sendingData,
        },
        {
          label: "Data integrity",
          health: dataIntegrity,
          fix: dataIntegrity ? undefined : dataIntegrityFix,
        },
      ],
    };
  }

  return {
    facets: unloadedFacets,
  };
}
