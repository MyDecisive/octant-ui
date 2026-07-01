import type { InstallAndConnectFormFields } from "@store/installAndConnectStore";

type IxCDemoPrefillConfig = {
  argoAgreement: InstallAndConnectFormFields["argoAgreement"];
  scope: {
    connectionName: InstallAndConnectFormFields["connectionName"];
    namespace: InstallAndConnectFormFields["namespace"];
  };
  argo: {
    url: InstallAndConnectFormFields["argoUrl"];
    accountToken: InstallAndConnectFormFields["accountToken"];
  };
  collector: {
    telemetryTypes: InstallAndConnectFormFields["telemetryTypes"];
    datadogUrl: InstallAndConnectFormFields["url"];
    datadogApiKey: InstallAndConnectFormFields["apiKey"];
  };
};

export const IxCDemoPrefillCopy = {
  argoAgreement: true,
  scope: {
    connectionName: "demo-connection",
    namespace: "mdai",
  },
  argo: {
    url: "https://argocd.demo.mydecisive.ai",
    accountToken: "argocd.demo-token",
  },
  collector: {
    telemetryTypes: ["logs", "traces"],
    datadogUrl: "https://http-intake.logs.datadoghq.com",
    datadogApiKey: "demo-datadog-api-key",
  },
} satisfies IxCDemoPrefillConfig;
