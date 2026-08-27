import { INPUT_VALIDATION_ERRORS } from "@copy/global";

export function validateRequired(value: unknown): string | undefined {
  if (typeof value === "string" && !value.trim()) {
    return INPUT_VALIDATION_ERRORS.MINIMUM_SELECTION;
  }
  if (Array.isArray(value) && value.length === 0) {
    return INPUT_VALIDATION_ERRORS.MINIMUM_SELECTION;
  }
  if (value === null || value === undefined) {
    return INPUT_VALIDATION_ERRORS.MINIMUM_SELECTION;
  }
  return undefined;
}
