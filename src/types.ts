import type { JSX } from "react";

export type DeployMethod = "argocd-sideload" | "argocd-manifests";

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
  type: "argocd-sideload";
  fields: {
    url: string;
  };
}

export interface SelfDeployment extends BasePayloadPart {
  type: "argocd-manifests";
}
export interface ConnectionPayload {
  // Deploy method
  deployment: ArgoDeployment | SelfDeployment;
  // Prepare Collector
  sourceType: "datadog";
  telemetryTypes?: TelemetryTypes[];
}

export interface Destination {
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
