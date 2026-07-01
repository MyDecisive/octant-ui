import type { InputValidationErrors } from "@app-types/validation";

export function getErrorOrHelperText(
  validationErrors: InputValidationErrors | null,
  helperText?: string,
  errorProp?: boolean,
) {
  if (!errorProp && !validationErrors) {
    return helperText;
  }

  if (errorProp) {
    return helperText;
  }

  if (validationErrors) {
    return Array.isArray(validationErrors)
      ? validationErrors[0]
      : validationErrors;
  }

  return undefined;
}
