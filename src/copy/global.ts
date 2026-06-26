import { FILTER_TYPES } from "@constants/enums";

export const SECRET_VALUE_MASK = "************************";

export const UNITS_BY_DATA_TYPE = {
  [FILTER_TYPES.LOG]: "GB",
  [FILTER_TYPES.TRACE]: "MM Spans",
};
