export const ERROR_SEVERITY = {
  ERROR: "error",
  WARN: "warn",
} as const;

export const ERROR_MODAL_ACT = {
  REPORT_BUG: "REPORT_BUG",
  VISIT_DOCS: "VISIT_DOCS",
  CLOSE: "CLOSE",
} as const;

export const FILTER_TYPES = {
  LOG: "logs",
  TRACE: "traces",
} as const;

export const ASYNC_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export const TELEMETRY_TYPES = {
  ...FILTER_TYPES,
  METRIC: "metrics",
} as const;
