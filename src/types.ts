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
  dataTypes?: string[];
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
