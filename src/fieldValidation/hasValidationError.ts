import type { InputValidationErrors } from "@app-types/validation";

export function hasValidationError(maybeErrors: InputValidationErrors | null) {
  if (maybeErrors == null) {
    return false;
  }

  return maybeErrors.length > 0;
}
