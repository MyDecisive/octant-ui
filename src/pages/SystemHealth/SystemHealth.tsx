import {
  HealthWidget,
  type HealthWidgetProps,
} from "@components/HealthWidget/HealthWidget";
import { ButtonRow } from "@components/layout/ButtonRow";
import { PageContainer } from "@components/layout/PageContainer";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { VerifyConnection as copy } from "../../copy/install/VerifyConnection.copy";
import {
  useManageSystemHealth,
  type ValidationStatus,
} from "./useManageSystemHealth";

function connectionStatusResponseToHealthWidgetProps(
  loading: boolean,
  connectionStatus: ValidationStatus | null,
): Omit<HealthWidgetProps, "title"> {
  if (loading) {
    return {
      status: "loading",
      facets: [
        {
          label: "Clients connected",
          loading: true,
        },
        {
          label: "Receiving data",
          loading: true,
        },
        {
          label: "Sending data",
          loading: true,
        },
        {
          label: "Data integrity",
          loading: true,
        },
      ],
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
          fix: dataIntegrity
            ? undefined
            : {
                label: "Data integrity failed",
                description:
                  "Some telemetry does not match expected validation results.",
                actions: [
                  {
                    text: "See Docs",
                    href: "https://docs.mydecisive.ai/",
                  },
                ],
              },
        },
      ],
    };
  }

  return {
    facets: [
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
    ],
  };
}

function smarthubStatusToHealthWidgetProps(
  loading: boolean,
  installed: boolean | null,
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

export function SystemHealthPage() {
  const {
    connectionStatus,
    error,
    loading,
    revalidate,
    smarthubInstalled,
    smarthubLoading,
    validation,
  } = useManageSystemHealth();

  const healthWidgetProps = connectionStatusResponseToHealthWidgetProps(
    loading,
    connectionStatus,
  );
  const smarthubWidgetProps = smarthubStatusToHealthWidgetProps(
    smarthubLoading,
    smarthubInstalled,
  );
  return (
    <PageContainer>
      <Stack gap={2} alignItems={"center"}>
        <Stack gap={1}>
          <HealthWidget
            title={copy.connection}
            timestamp={formatLastRun(validation?.timestamp)}
            {...healthWidgetProps}
          />
          <ButtonRow>
            {(healthWidgetProps.status === "error" || error) && (
              <Button variant="contained" onClick={() => void revalidate()}>
                Revalidate
              </Button>
            )}
          </ButtonRow>
        </Stack>
        <HealthWidget
          title="Smarthub Infrastructure"
          timestamp={formatLastRun(validation?.timestamp)}
          simple
          {...smarthubWidgetProps}
        />
      </Stack>
    </PageContainer>
  );
}
