import type { AppStateForm } from "@store";
import type { ArgoDeployment, ConnectionPayload, TelemetryTypes } from "@types";

interface ValidatedAppStateForm {
  deployMethod: "argocd" | "self";
  branch: string;
  accountToken: string;
  telemetryTypes: TelemetryTypes[];
  url: string;
  apiKey: string;
  connectionName: string;
}

export function appStateFormToConnectionPayload(
  formState: AppStateForm,
): ConnectionPayload {
  const { telemetryTypes, deployMethod, branch } =
    formState as ValidatedAppStateForm;

  const initialPayload: Pick<
    ConnectionPayload,
    "sourceType" | "telemetryTypes"
  > = {
    sourceType: "datadog",
    telemetryTypes: telemetryTypes,
  };

  if (deployMethod === "argocd") {
    const deployment: ArgoDeployment = {
      type: deployMethod,
      fields: {
        branch,
      },
    };
    return {
      ...initialPayload,
      deployment,
    };
  }

  return {
    ...initialPayload,
    deployment: {
      type: deployMethod,
    },
  };
}
