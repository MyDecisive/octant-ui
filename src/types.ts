import {
  type Filter as ClientFilter,
  type ConnectionData,
  type Deployment,
  type Overall,
  type Overall_Metric,
  type TelemetryDestination,
} from "@mydecisiveai/octant-client";
import type { JSX } from "react";
import { ERROR_MODAL_ACT, ERROR_SEVERITY } from "./constants/error";
import { ASYNC_STATUS } from "./constants/status";

export type DeployMethod = "argocd-sideload" | "argocd-manifests";

export type IntegrationType = "datadog" | "argocd";
export type TelemetryTypes = "logs" | "metrics" | "traces";
export const FilterTypes = {
  LOG: "logs",
  TRACE: "traces",
} as const;
export type FilterTypes = (typeof FilterTypes)[keyof typeof FilterTypes];

interface Destination {
  type: "datadog";
  integrationName: string;
}

export interface ManifestPayload {
  sourceType: "datadog";
  telemetryTypes: TelemetryTypes[];
  deployment: {
    integrationName: string;
    type: DeployMethod;
  };
  destinations: Destination[];
}

export type DataFidelityDetails =
  | "notReceiving"
  | "notSending"
  | "missingFields"
  | "oom"
  | "resourceLimit";

export interface DataFidelityResponse {
  receivingData: boolean;
  sendingData: boolean;
  dataIntegrity: boolean;
  details: null | DataFidelityDetails;
}

export type StatusRowState = "loading" | boolean | null;
export type AsyncStatus = (typeof ASYNC_STATUS)[keyof typeof ASYNC_STATUS];

export interface FidelityState {
  receivingData: StatusRowState;
  sendingData: StatusRowState;
  dataIntegrity: StatusRowState;
  details: null | "loading" | DataFidelityDetails;
}

export type ViewMap = Record<
  string,
  {
    Component: () => JSX.Element;
    label: string;
  }
>;

export type ViewKey = keyof ViewMap;

export type ViewOrder = ViewKey[];

// Table Types
export interface BaseRowDefinition {
  id: string;
}

export type TimeRange = "today" | "mtd" | "lastMonth";

// Form validation types
export type InputValidationErrors = string[] | string | undefined;
export type FieldValidator<T = string> = (value?: T) => string | undefined;

// eslint-disable-next-line
export type FormFields = Record<string, FieldValidator<any>[]>;

export type FieldValidationMap = Record<
  string,
  {
    // eslint-disable-next-line
    validate: (value?: any) => InputValidationErrors;
    onValidation: (error: InputValidationErrors) => void;
  }
>;

export type FieldErrorsMap = Record<
  keyof FormFields,
  InputValidationErrors | null
>;

export interface UIFilter extends Pick<
  ClientFilter,
  "includeErr" | "pctSampled"
> {
  type: FilterTypes;
}

// UI versions of client types
export interface UIConnectionScope {
  connectionName?: string;
  namespace?: string;
}

type UIDeployment = Pick<Deployment, "type" | "integrationName">;
type UIDestination = Pick<TelemetryDestination, "integrationName" | "type">;

export interface UIConnectionData extends Pick<
  ConnectionData,
  "telemetryTypes"
> {
  scope?: UIConnectionScope;
  deployment: UIDeployment;
  destinations: UIDestination[];
}

export interface UIOverall extends Pick<Overall, "cost"> {
  [FilterTypes.LOG]?: Overall_Metric;
  [FilterTypes.TRACE]?: Overall_Metric;
}

// error modal types
export type ErrorModalActs =
  (typeof ERROR_MODAL_ACT)[keyof typeof ERROR_MODAL_ACT];
export type ErrorModalSeverity =
  (typeof ERROR_SEVERITY)[keyof typeof ERROR_SEVERITY];

// Copy types
export type ErrorModalCTA = {
  text: string;
  act: ErrorModalActs[];
};
export type ErrorModalContent = {
  header: string;
  severity: ErrorModalSeverity;
  body?: string;
  showNetworkError?: boolean;
  actions: ErrorModalCTA[];
};
