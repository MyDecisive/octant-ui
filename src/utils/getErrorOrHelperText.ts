import type { InputValidationErrors } from "@app-types/validation";

/**
 * @param validationErrors provided by `useFormValidation`'s `validationCallbacks`
 * @param helperText Text provided to the form input component, displayed when no validation errors are present OR when the form input component parent indicates it is managing error display.
 * @param parentManagesErrorDisplay Boolean indicating that the input's parent component is managing error display itself, so this helper should defer to helperText instead of surfacing validationErrors.
 * @returns string | undefined
 */
export function getErrorOrHelperText(
  validationErrors: InputValidationErrors | null,
  helperText?: string,
  parentManagesErrorDisplay?: boolean,
): string | undefined {
  if (parentManagesErrorDisplay) {
    return helperText;
  }

  if (!validationErrors) {
    return helperText;
  }

  return Array.isArray(validationErrors)
    ? validationErrors[0]
    : validationErrors;
}
