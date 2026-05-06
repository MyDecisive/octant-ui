import type { JSX } from "react";

export type DeployMethod = "argocd-sideload" | "argocd-manifests";

export interface BaseFlowViewProps {
  onClickProgress: () => void;
  viewKey: string;
}

export type IntegrationType = "datadog" | "argocd";
export type TelemetryTypes = "logs" | "metrics" | "traces";

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

export interface FidelityState {
  receivingData: StatusRowState;
  sendingData: StatusRowState;
  dataIntegrity: StatusRowState;
  details: null | "loading" | DataFidelityDetails;
}

export type ViewMap = Record<
  string,
  {
    Component: (props: BaseFlowViewProps) => JSX.Element;
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
