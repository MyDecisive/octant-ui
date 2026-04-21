import type { GridColDef } from "@mui/x-data-grid";
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

export type DataState = "loading" | boolean | null;

export interface FidelityState {
  receivingData: DataState;
  sendingData: DataState;
  dataIntegrity: DataState;
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

export type FilterStatus = "inactive" | "updating" | "applied";

// Table Types
export interface BaseRowDefinition {
  id: string;
}

export type ColumnType<T extends BaseRowDefinition = BaseRowDefinition> =
  GridColDef<T>;
