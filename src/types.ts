import type { JSX } from "react";

export interface FormFieldProps {
  id: number;
  formType: string;
  label?: string;
  description?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  infoText?: { title: string; description: string };
  helperText?: string;
  optional?: boolean;
  validation?: (value: string) => string | undefined;
}

export interface StepProps {
  id: number;
  key: string;
  title: string;
  description?: string;
}

export type IntegrationType = "datadog" | "otlphttp" | "otlpgrpc";
export type TelemetryTypes = "logs" | "metrics" | "traces";

interface BasePayloadPart {
  type: string;
  fields?: Record<string, string>;
}

interface DatadogDestination extends BasePayloadPart {
  type: "datadog";
  fields: {
    url: string;
    apiKey: string;
  };
}

interface ArgoDeployment extends BasePayloadPart {
  type: "argocd";
  fields: {
    branch: string;
    accountToken: string;
  };
}

interface SelfDeployment extends BasePayloadPart {
  type: "self";
}
export interface ConnectionPayloadProps {
  // Deploy method
  deployment: ArgoDeployment | SelfDeployment;
  // Prepare Collector
  sourceType: "datadog";
  telemetryTypes?: TelemetryTypes[];
  connectionName?: string;

  destination: DatadogDestination;
}

export interface StepDefinition {
  id: number;
  key: string;
  title: string;
  description?: string;
}

interface Nav {
  activeStep: StepDefinition["id"];
}

export interface Store {
  nav: Nav;
  form: ConnectionPayloadProps;
}

export interface Action {
  type: string;
  payload?: unknown;
}

export type ViewMap = Record<
  string,
  {
    Component: (props: {
      viewKey?: string;
      onClickProgress: () => void;
    }) => JSX.Element;
    label?: string;
  }
>;

export type ViewKey = keyof ViewMap;

export type ViewLabelMap = Record<ViewKey, string>;

export type ViewOrder = ViewKey[];
