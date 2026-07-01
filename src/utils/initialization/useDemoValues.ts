import type { InstallAndConnectFormFields } from "@store/installAndConnectStore";
import { IxCDemoPrefillCopy } from "../../copy/install/IxCDemoPrefill";

export const isDemo = import.meta.env.VITE_USE_MOCKS === "true";

export function createIxCDemoValues(): Partial<InstallAndConnectFormFields> {
  return {
    argoAgreement: IxCDemoPrefillCopy.argoAgreement,
    connectionName: IxCDemoPrefillCopy.scope.connectionName,
    namespace: IxCDemoPrefillCopy.scope.namespace,
    argoUrl: IxCDemoPrefillCopy.argo.url,
    accountToken: IxCDemoPrefillCopy.argo.accountToken,
    telemetryTypes: IxCDemoPrefillCopy.collector.telemetryTypes,
    url: IxCDemoPrefillCopy.collector.datadogUrl,
    apiKey: IxCDemoPrefillCopy.collector.datadogApiKey,
  };
}
