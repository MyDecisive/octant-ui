import type { InputValidationErrors } from "@types";

export function hasValidationError(maybeErrors: InputValidationErrors | null) {
  if (maybeErrors == null) {
    return false;
  }

  return maybeErrors.length > 0;
}
