import type { FilterTypes, UIFilter } from "@types";

export interface FiltersSlice {
  filters: Partial<Record<FilterTypes, UIFilter>>;
}

export function createDefaultFiltersSlice(): FiltersSlice {
  return {
    filters: {},
  };
}
