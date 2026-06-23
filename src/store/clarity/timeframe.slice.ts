import type { SelectOption } from "@components/formInputs/Select";
import { Timeframe } from "@mydecisiveai/octant-client";

export interface TimeframeSlice {
  selectedTimeframe: Timeframe;
  timeframeOptions: SelectOption[];
  hasLogData?: boolean;
  hasTraceData?: boolean;
}

export function createDefaultTimeframeSlice(): TimeframeSlice {
  return {
    selectedTimeframe: Timeframe.TIMEFRAME_24HR,
    timeframeOptions: [],
  };
}
