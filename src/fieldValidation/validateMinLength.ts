import { INPUT_VALIDATION_ERRORS } from "@copy/global";

export function validateMinLength(minLength: number) {
  return (value?: string): string | undefined => {
    const trimmedLength = (value ?? "").trim().length;

    if (trimmedLength >= minLength) {
      return undefined;
    }

    return INPUT_VALIDATION_ERRORS.MINIMUM_LENGTH(minLength);
  };
}
