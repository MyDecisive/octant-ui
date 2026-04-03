import type { AppStateForm } from "@store";
import type { ConnectionPayload, TelemetryTypes } from "@types";

interface ValidatedAppStateForm {
  deployMethod: "argocd-sideload" | "self";
  apiUrl: string;
  accountToken: string;
  telemetryTypes: TelemetryTypes[];
  url: string;
  apiKey: string;
  connectionName: string;
}

export function appStateFormToConnectionPayload(
  formState: AppStateForm,
): ConnectionPayload {
  const { telemetryTypes, deployMethod, connectionName } =
    formState as ValidatedAppStateForm;

  const initialPayload: Pick<
    ConnectionPayload,
    "sourceType" | "telemetryTypes"
  > = {
    sourceType: "datadog",
    telemetryTypes: telemetryTypes,
  };

  console.log(deployMethod)
  if (deployMethod === "argocd") {
    const deployment = {
      // type: deployMethod,
      // fields: {
      //   apiUrl,
      //   accountToken
      // },
      type: "argocd-sideload",
      integrationName: connectionName
    };
    return {
      ...initialPayload,
      deployment,
      destinations: [{
        integrationName: connectionName,
        type: "datadog"
      }]
    };
  }

  return {
    ...initialPayload,
    deployment: {
      type: deployMethod,
    },
  };
}
