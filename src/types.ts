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

export interface ConnectionPayloadProps {
  targetRevisionBranch?: string;
  collectorName?: string;
  namespace?: string;
  apiKey?: string;
  exportLocationType?: IntegrationType;
  exportLocation?: string;
  argoAccountToken?: string;
  dataTypes?: string[];
  deployMethod: "argo" | "self";
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
