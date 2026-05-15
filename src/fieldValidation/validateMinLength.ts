export function validateMinLength(minLength: number) {
  return (value?: string): string | undefined => {
    if (typeof value !== "string" || value.trim().length >= minLength) {
      return undefined;
    }

    return `Must be at least ${minLength} characters`;
  };
}
