import type { SelectOption } from "@components/formInputs/Select";
import { Timeframe } from "@mydecisiveai/octant-client";
import type { FilterTypes } from "@types";

export interface TimeframeSlice {
  selectedTimeframe: Timeframe;
  timeframeOptions: SelectOption[];
  hasData: Partial<Record<FilterTypes, boolean>>;
}

export function createDefaultTimeframeSlice(): TimeframeSlice {
  return {
    selectedTimeframe: Timeframe.TIMEFRAME_24HR,
    timeframeOptions: [],
    hasData: {},
  };
}
