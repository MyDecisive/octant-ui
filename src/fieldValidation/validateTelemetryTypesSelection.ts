import type { TelemetryTypes } from "@types";

export function validateTelemetryTypesSelection(selected: TelemetryTypes[]) {
  if (
    !selected.length ||
    (!selected.includes("logs") && !selected.includes("traces"))
  ) {
    return 'At least one of "Logs" or "Traces" must be selected';
  }

  return undefined;
}
