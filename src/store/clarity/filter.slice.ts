import type { UIFilter } from "@app-types/contracts";
import type { UIFilterType } from "@app-types/enums";

export interface FiltersSlice {
  filters: Partial<Record<UIFilterType, UIFilter>>;
}

export function createDefaultFiltersSlice(): FiltersSlice {
  return {
    filters: {},
  };
}
