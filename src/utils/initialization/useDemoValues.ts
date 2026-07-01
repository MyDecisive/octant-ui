import type { InstallAndConnectFormFields } from "@store/installAndConnectStore";
import { IxCDemoPrefillCopy } from "../../copy/install/IxCDemoPrefill";

export const isDemo = import.meta.env.VITE_USE_MOCKS === "true";

export function createIxCDemoValues(): Partial<InstallAndConnectFormFields> {
  return IxCDemoPrefillCopy;
}
