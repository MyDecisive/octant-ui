import type { SelectOption } from "@components/formInputs/Select";
import {
  Timeframe,
  TimeframeStatusResponse_Code,
  type TimeframeStatusResponse_Status,
} from "@mydecisiveai/octant-client";
import { ClarityCopy as cc } from "../copy/clarity/Clarity.copy";

export const timeframeLabels: Record<Timeframe, string> = {
  [Timeframe.TIMEFRAME_UNSPECIFIED]: "Unspecified",
  [Timeframe.TIMEFRAME_24HR]: cc.timerange.timerangeOptions.T24H,
  [Timeframe.TIMEFRAME_MTD]: cc.timerange.timerangeOptions.T30D,
  [Timeframe.TIMEFRAME_LM]: cc.timerange.timerangeOptions.TP30D,
};

const codeToChip: Record<
  TimeframeStatusResponse_Code,
  SelectOption["chip"] | undefined
> = {
  [TimeframeStatusResponse_Code.UNSPECIFIED]: undefined,
  [TimeframeStatusResponse_Code.OK]: undefined,
  [TimeframeStatusResponse_Code.NO_DATA]: {
    label: cc.timerange.status.processing,
    color: "default",
    size: "small",
  },
  [TimeframeStatusResponse_Code.NOT_ENOUGH]: {
    label: cc.timerange.status.processing,
    color: "default",
    size: "small",
  },
};
// TODO: selected item annotations per designs
export function timeframeToPickerOptions(
  statuses: TimeframeStatusResponse_Status[],
): SelectOption[] {
  return statuses
    .filter(({ timeframe }) => timeframe !== Timeframe.TIMEFRAME_UNSPECIFIED)
    .map(({ timeframe, status }) => ({
      value: String(timeframe),
      label: timeframeLabels[timeframe],
      chip: codeToChip[status],
      disabled: status !== TimeframeStatusResponse_Code.OK,
    }));
}
