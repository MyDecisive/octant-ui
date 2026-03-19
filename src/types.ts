import type { JSX } from "react";

export interface BaseFlowViewProps {
  onClickProgress: () => void;
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

export type ViewOrder = ViewKey[];
