import { MLTType } from "@mydecisiveai/octant-client";
import type { UIConnectionScope } from "@types";
export interface InitSlice {
  connectionScope?: UIConnectionScope;
  logsConfigured: boolean;
  tracesConfigured: boolean;
}

export interface ClarityStoreInitProps {
  connectionScope?: UIConnectionScope;
  configuredTelemetryTypes?: MLTType[];
}

export function createDefaultInitSlice(
  initProps?: ClarityStoreInitProps,
): InitSlice {
  return {
    connectionScope: initProps?.connectionScope,
    logsConfigured: (initProps?.configuredTelemetryTypes ?? []).includes(
      MLTType.MLT_TYPE_LOG,
    ),
    tracesConfigured: (initProps?.configuredTelemetryTypes ?? []).includes(
      MLTType.MLT_TYPE_TRACE,
    ),
  };
}
