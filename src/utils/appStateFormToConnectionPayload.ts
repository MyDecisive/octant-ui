import type { AppStateForm } from "@store";
import type { ArgoDeployment, ConnectionPayload, TelemetryTypes } from "@types";

function existsAndHasLength(arg?: string | unknown[]): boolean {
  return !!arg && arg.length > 0;
}

function validateAppStateForm(formState: AppStateForm) {
  return Object.entries(formState).every(
    ([key, value]: [string, string | unknown[] | undefined]) => {
      if (key === "deployMethod") {
        return value === "argocd" || value === "self";
      }
      return existsAndHasLength(value);
    },
  );
}

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
  if (!validateAppStateForm(formState)) {
    throw new Error("Invalid form state");
  }

  const { telemetryTypes, deployMethod, branch, accountToken } =
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
        accountToken,
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
