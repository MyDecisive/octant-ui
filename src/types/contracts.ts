import type { TelemetryTypes, UIFilterType } from "@app-types/enums";
import type { FILTER_TYPES } from "@constants/enums";
import {
  type ConnectionData,
  type Deployment,
  type Filter,
  type Overall,
  type Overall_Metric,
  type TelemetryDestination,
} from "@mydecisiveai/octant-client";

export interface UIFilter extends Pick<Filter, "includeErr" | "pctSampled"> {
  type: UIFilterType;
}

// UI versions of client types
export interface UIConnectionScope {
  connectionName: string;
  namespace: string;
}

type UIDeployment = Pick<Deployment, "type" | "integrationName">;
type UIDestination = Pick<TelemetryDestination, "integrationName" | "type">;

export interface UIConnectionData extends Pick<
  ConnectionData,
  "telemetryTypes"
> {
  scope: UIConnectionScope;
  deployment: UIDeployment;
  destinations: UIDestination[];
}

export interface UIOverall extends Pick<Overall, "cost"> {
  [FILTER_TYPES.LOG]?: Overall_Metric;
  [FILTER_TYPES.TRACE]?: Overall_Metric;
}
export interface UpdateCollectorSettingsParams {
  connectionName: string;
  namespace: string;
  telemetryTypes: TelemetryTypes[];
  datadogUrl: string;
  datadogApiKey: string;
}
