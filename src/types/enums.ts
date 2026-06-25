import {
  ASYNC_STATUS,
  ERROR_MODAL_ACT,
  ERROR_SEVERITY,
  FILTER_TYPES,
  TELEMETRY_TYPES,
} from "@constants/enums";
import type { ValueOf } from "./utility";

export type ErrorModalActs = ValueOf<typeof ERROR_MODAL_ACT>;
export type ErrorModalSeverity = ValueOf<typeof ERROR_SEVERITY>;

export type AsyncStatus = ValueOf<typeof ASYNC_STATUS>;

export type UIFilterType = ValueOf<typeof FILTER_TYPES>;

export type TelemetryTypes = ValueOf<typeof TELEMETRY_TYPES>;
