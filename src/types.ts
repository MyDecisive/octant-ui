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

export type ViewMap = Record<
  string,
  {
    Component: (props: BaseFlowViewProps) => JSX.Element;
    label: string;
  }
>;

export type ViewKey = keyof ViewMap;

export type ViewOrder = ViewKey[];
