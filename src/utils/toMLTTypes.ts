import type { TelemetryTypes } from "@app-types/enums";
import { MLTType } from "@mydecisiveai/octant-client/dist/octant/v1alpha/type_pb";

const telemetryToMLTType: Record<TelemetryTypes, MLTType> = {
  metrics: MLTType.MLT_TYPE_METRIC,
  traces: MLTType.MLT_TYPE_TRACE,
  logs: MLTType.MLT_TYPE_LOG,
};

export function toMLTTypes(telemetryTypes: TelemetryTypes[]): MLTType[] {
  return telemetryTypes.map((t) => telemetryToMLTType[t]);
}
