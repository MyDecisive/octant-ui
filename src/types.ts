import type { JSX } from "react";

export interface BaseFlowViewProps {
  onClickProgress: () => void;
}

export type IntegrationType = "datadog" | "argocd";
export type TelemetryTypes = "logs" | "metrics" | "traces";

interface BasePayloadPart {
  type: string;
  fields?: Record<string, string>;
}

export interface ArgoDeployment extends BasePayloadPart {
  type: "argocd";
  fields: {
    branch: string;
  };
}

export interface SelfDeployment extends BasePayloadPart {
  type: "self";
}
export interface ConnectionPayload {
  // Deploy method
  deployment: ArgoDeployment | SelfDeployment;
  // Prepare Collector
  sourceType: "datadog";
  telemetryTypes?: TelemetryTypes[];
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
