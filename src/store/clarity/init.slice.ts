import type { UIConnectionScope } from "@app-types/contracts";
import type { UIFilterType } from "@app-types/enums";
import { FILTER_TYPES } from "@constants/enums";
import { MLTType } from "@mydecisiveai/octant-client";
export interface InitSlice {
  connectionScope?: UIConnectionScope;
  configured: Partial<Record<UIFilterType, boolean>>;
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
          accum[FILTER_TYPES.LOG] = true;
        }
        if (current === MLTType.MLT_TYPE_TRACE) {
          accum[FILTER_TYPES.TRACE] = true;
        }
        return accum;
      },
      {} as Partial<Record<UIFilterType, boolean>>,
    ),
  };
}
