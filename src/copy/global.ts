import { FILTER_TYPES } from "@constants/enums";
import { formatTimestamp } from "@utils/formatTimestamp";

export const SECRET_VALUE_MASK = "************************";

export const UNITS_BY_DATA_TYPE = {
  [FILTER_TYPES.LOG]: "GB",
  [FILTER_TYPES.TRACE]: "MM Spans",
};

export function lastRun(timestamp?: string) {
  const formattedTimestamp = formatTimestamp(timestamp);

  return formattedTimestamp ? `Last run ${formattedTimestamp}` : undefined;
}
export const INPUT_VALIDATION_ERRORS = {
  URL: "Enter a valid URL. Expected format: http://www.abc.com or localhost:8080",
  TELEMETRY_TYPES: 'At least one of "Logs" or "Traces" must be selected',
};
