export function validateRequired(value: unknown): string | undefined {
  if (typeof value === "string" && !value.trim()) {
    return "This field is required";
  }
  if (Array.isArray(value) && value.length === 0) {
    return "At least one item must be selected";
  }
  if (value === null || value === undefined) {
    return "This field is required";
  }
  return undefined;
}
