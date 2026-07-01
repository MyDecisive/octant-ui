import type { UIFilterType } from "@app-types/enums";
import { FILTER_TYPES } from "@constants/enums";
import { FilterType } from "@mydecisiveai/octant-client";

const filtersToFilterTypes: Partial<Record<UIFilterType, FilterType>> = {
  [FILTER_TYPES.LOG]: FilterType.LOG,
  [FILTER_TYPES.TRACE]: FilterType.TRACE,
};

export function toFilterType(type: UIFilterType) {
  return filtersToFilterTypes[type];
}
