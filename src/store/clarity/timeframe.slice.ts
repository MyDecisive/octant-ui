import type { SelectOption } from "@app-types/components";
import type { UIFilterType } from "@app-types/enums";
import { Timeframe } from "@mydecisiveai/octant-client";

export interface TimeframeSlice {
  selectedTimeframe: Timeframe;
  timeframeOptions: SelectOption[];
  hasData: Partial<Record<UIFilterType, boolean>>;
}

export function createDefaultTimeframeSlice(): TimeframeSlice {
  return {
    selectedTimeframe: Timeframe.TIMEFRAME_24HR,
    timeframeOptions: [],
    hasData: {},
  };
}
