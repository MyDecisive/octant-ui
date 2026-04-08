import { type ButtonProps } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";

import { useOctantConnectStore } from "@store";
import type {
  ArgoDeployment,
  ConnectionPayload,
  DeployMethod,
  Destination,
  TelemetryTypes,
} from "@types";
import {
  connections,
  integrations,
  type ArgoCdIntegrationBody,
  type DatadogIntegrationBody,
} from "../../../services/api";
import type { ArgoDeployProps } from "./types";

interface ConnectionPayloadDatas {
  deployMethod: DeployMethod;
  telemetryTypes: TelemetryTypes[];
  connectionName: string;
}

function appStateFormToConnectionPayload(
  formState: ConnectionPayloadDatas,
): ConnectionPayload {
  const { telemetryTypes, deployMethod, connectionName  } = formState;

  const initialPayload: Pick<
    ConnectionPayload,
    "sourceType" | "telemetryTypes"
  > = {
    sourceType: "datadog",
    telemetryTypes: telemetryTypes,
  };

  const destinations: Destination[] = [{
    integrationName: connectionName,
    type: "datadog"
  }]

  if (deployMethod === "argocd-sideload") {
    const deployment: ArgoDeployment = {
      type: deployMethod,
      integrationName: connectionName
    };
    return {
      ...initialPayload,
      deployment,
      destinations
    };
  }

  return {
    ...initialPayload,
    deployment: {
      type: deployMethod,
    },
    destinations
  };
}

function determineDeployButtonProps(
  loading: boolean,
  hasDeployed: boolean,
): {
  loading: boolean;
  text: string;
  variant: ButtonProps["variant"];
  color?: ButtonProps["color"];
} {
  if (loading) {
    return {
      loading,
      text: "Deploying...",
      variant: "secondary",
    };
  }

  if (hasDeployed) {
    return {
      loading,
      text: "Done",
      variant: "contained",
      color: "success",
    };
  }

  return {
    loading,
    text: "Deploy collector",
    variant: "secondary",
  };
}

export function useArgoDeployHandlers({
  hasDeployed,
  onDeployFinish,
}: ArgoDeployProps) {
  const [loading, setLoading] = useState(false);
  const [deployError, setDeployError] = useState<string | null>(null);
  const {
    connectionName,
    url,
    apiKey,
    accountToken,
    telemetryTypes,
    deployMethod,
    argoUrl,
  } = useOctantConnectStore(useShallow((state) => state.form));

  const handleDeployButtonClick = useCallback(() => {
    if (!connectionName || !url || !apiKey || !accountToken) {
      return;
    }

    const connectionPayload = appStateFormToConnectionPayload({
      telemetryTypes,
      deployMethod,
      connectionName,
    });
    const ddIntegrationPayload: DatadogIntegrationBody = {
      url: url,
      apiKey: apiKey,
    };
    const argoIntegrationPayload: ArgoCdIntegrationBody = {
      accountToken: accountToken,
      url: argoUrl!,
    };

    setDeployError(null);
    setLoading(true);

    async function makeTheCalls() {
      try {
        await Promise.all([
          integrations.upsert("datadog", connectionName!, ddIntegrationPayload),
          integrations.upsert(
            "argocd",
            connectionName!,
            argoIntegrationPayload,
          ),
        ]);

        await connections.upsert(connectionName!, connectionPayload);
        onDeployFinish();
      } catch (error: unknown) {
        console.error("Failed to deploy collector", error);
        setDeployError(
          error instanceof Error
            ? error.message
            : "Something went wrong while deploying the collector.",
        );
      } finally {
        setLoading(false);
      }
    }

    void makeTheCalls();
  }, [
    connectionName,
    url,
    apiKey,
    accountToken,
    telemetryTypes,
    deployMethod,
    argoUrl,
    onDeployFinish,
  ]);

  const deployButtonProps = useMemo(
    () => determineDeployButtonProps(loading, hasDeployed),
    [loading, hasDeployed],
  );

  const returnValues = useMemo(
    () => ({
      ...deployButtonProps,
      handleDeployButtonClick,
      deployError,
    }),
    [deployButtonProps, handleDeployButtonClick, deployError],
  );

  return returnValues;
}
