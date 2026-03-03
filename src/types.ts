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
}

export interface StepProps {
  id: number;
  key: string;
  title: string;
  description?: string;
  formFields?: FormFieldProps[];
}

export interface ConnectionPayloadProps {
  targetRevisionBranch?: string;
  collectorName?: string;
  namespace?: string;
  integration?: string;
  apiKey?: string;
  exportLocationType?: string;
  exportLocation?: string;
  dataTypes?: string[];
}
