import type { LogData, SpanData } from "@app-types/components";
import type { UIOverall } from "@app-types/contracts";
import { FILTER_TYPES } from "@constants/enums";

export interface BudgetSlice {
  overall?: UIOverall | null;
  table: {
    [FILTER_TYPES.LOG]?: LogData[];
    [FILTER_TYPES.TRACE]?: SpanData[];
  };
}

export function createDefaultBudgetSlice(): BudgetSlice {
  return {
    table: {},
  };
}
