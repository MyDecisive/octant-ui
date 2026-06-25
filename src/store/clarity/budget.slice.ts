import { FilterTypes, type UIOverall } from "@types";
import type { LogData, SpanData } from "../../pages/Clarity/constants";
import type { FILTER_TYPES } from "@constants/enums";

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
