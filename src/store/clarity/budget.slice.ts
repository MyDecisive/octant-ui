import { FilterTypes, type UIOverall } from "@types";
import type { LogData, SpanData } from "../../pages/Clarity/constants";

export interface BudgetSlice {
  overall?: UIOverall | null;
  table: {
    [FilterTypes.LOG]?: LogData[];
    [FilterTypes.TRACE]?: SpanData[];
  };
}

export function createDefaultBudgetSlice(): BudgetSlice {
  return {
    table: {},
  };
}
