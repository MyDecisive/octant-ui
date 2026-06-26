import { SECRET_VALUE_MASK } from "@copy/global";

export function isMaskedValue(value: string | undefined) {
  return value === SECRET_VALUE_MASK;
}

export function getSubmittedCollectorValue(value: string | undefined) {
  return isMaskedValue(value) ? "" : (value ?? "");
}
