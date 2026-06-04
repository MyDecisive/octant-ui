import { SECRET_VALUE_MASK } from "../constants/forms";

export function isMaskedCollectorValue(value: string | undefined) {
  return value === SECRET_VALUE_MASK;
}

export function getSubmittedCollectorValue(value: string | undefined) {
  return isMaskedCollectorValue(value) ? "" : (value ?? "");
}
