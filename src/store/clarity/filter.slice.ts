import type { UIFilter } from "@types";

export interface FiltersSlice {
  logFilter?: UIFilter;
  traceFilter?: UIFilter;
}

export function createDefaultFiltersSlice(): FiltersSlice {
  return {};
}
