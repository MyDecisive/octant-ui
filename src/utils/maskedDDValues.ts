export const MASKED_DATADOG_URL = "**** datadog_url ****";
export const MASKED_DATADOG_API_KEY = "**** datadog_api_key ****";

export function isMaskedCollectorValue(value: string | undefined) {
  return value === MASKED_DATADOG_URL || value === MASKED_DATADOG_API_KEY;
}

export function getSubmittedCollectorValue(value: string | undefined) {
  return isMaskedCollectorValue(value) ? "" : (value ?? "");
}
