export interface StepProps {
  id: number;
  title: string;
  subtitle: string;
  status: string;
  button?: string;
}

export interface FormProps {
  [key: string]: any;
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

// export interface ControlPayloadProps {

// }
