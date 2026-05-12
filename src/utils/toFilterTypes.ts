import { FilterType } from "@mydecisiveai/octant-client";
import type { FilterTypes } from "@types";

const filtersToFilterTypes: Record<FilterTypes, FilterType> = {
  logs: FilterType.LOG,
  traces: FilterType.TRACE,
};

export function toFilterType(type: FilterTypes) {
  return filtersToFilterTypes[type];
}
