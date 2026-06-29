import { MLTType } from "@mydecisiveai/octant-client";
import { FilterTypes, type UIConnectionScope } from "@types";
export interface InitSlice {
  connectionScope?: UIConnectionScope;
  configured: Partial<Record<FilterTypes, boolean>>;
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
    configured: (initProps?.configuredTelemetryTypes ?? []).reduce(
      (accum, current) => {
        if (current === MLTType.MLT_TYPE_LOG) {
          accum[FilterTypes.LOG] = true;
        }
        if (current === MLTType.MLT_TYPE_TRACE) {
          accum[FilterTypes.TRACE] = true;
        }
        return accum;
      },
      {} as Partial<Record<FilterTypes, boolean>>,
    ),
  };
}
