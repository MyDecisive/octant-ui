import type { SelectOption } from "@components/formInputs/Select";
import {
  Timeframe,
  TimeframeStatusResponse_Code,
  type TimeframeStatusResponse_Status,
} from "@mydecisiveai/octant-client";

export const timeframeLabels: Record<Timeframe, string> = {
  [Timeframe.TIMEFRAME_UNSPECIFIED]: "Unspecified",
  [Timeframe.TIMEFRAME_24HR]: "Today",
  [Timeframe.TIMEFRAME_MTD]: "Month to date",
  [Timeframe.TIMEFRAME_LM]: "Last month",
};

const codeToChip: Record<
  TimeframeStatusResponse_Code,
  SelectOption["chip"] | undefined
> = {
  [TimeframeStatusResponse_Code.UNSPECIFIED]: undefined,
  [TimeframeStatusResponse_Code.OK]: undefined,
  [TimeframeStatusResponse_Code.NO_DATA]: {
    label: "Processing",
    color: "default",
    size: "small",
  },
  [TimeframeStatusResponse_Code.NOT_ENOUGH]: {
    label: "Processing",
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
