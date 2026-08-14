import type { TelemetryTypes } from "@app-types/enums";
import { MLTType } from "@mydecisiveai/octant-client/dist/octant/v1alpha/type_pb";

const mltTypeToTelemetryType: Record<
  Exclude<MLTType, MLTType.MLT_TYPE_UNSPECIFIED>,
  TelemetryTypes
> = {
  [MLTType.MLT_TYPE_METRIC]: "metrics",
  [MLTType.MLT_TYPE_TRACE]: "traces",
  [MLTType.MLT_TYPE_LOG]: "logs",
};

export function fromMLTTypes(mltTypes: MLTType[]): TelemetryTypes[] {
  return mltTypes
    .filter((t) => t !== MLTType.MLT_TYPE_UNSPECIFIED)
    .map((t) => mltTypeToTelemetryType[t]);
}
