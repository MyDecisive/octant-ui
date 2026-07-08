import type { TelemetryTypes } from "@app-types/enums";
import { INPUT_VALIDATION_ERRORS } from "@copy/global";

export function validateTelemetryTypesSelection(selected: TelemetryTypes[]) {
  if (
    !selected.length ||
    (!selected.includes("logs") && !selected.includes("traces"))
  ) {
    return INPUT_VALIDATION_ERRORS.TELEMETRY_TYPES;
  }

  return undefined;
}
