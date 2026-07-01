import type { InstallAndConnectFormFields } from "@store/installAndConnectStore";

export const IxCDemoPrefillCopy = {
  argoAgreement: true,
  namespace: "mdai",
  argoUrl: "https://argocd.demo.mydecisive.ai",
  accountToken: "argocd.demo-token",
  telemetryTypes: ["logs", "traces"],
  url: "https://http-intake.logs.datadoghq.com",
  apiKey: "demo-datadog-api-key",
  connectionName: "demo-connection",
} satisfies Partial<InstallAndConnectFormFields>;
