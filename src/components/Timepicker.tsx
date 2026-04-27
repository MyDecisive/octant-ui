import {
  Select,
  type SelectOption,
  type SelectProps,
} from "@components/formInputs/Select";
import type { TimeRange } from "@types";

interface TimepickerProps extends Omit<SelectProps, "options" | "selected"> {
  value: TimeRange;
}

const initialOptions: SelectOption[] = [
  {
    value: "today",
    label: "Today",
    helperText: "10 mins ago",
  },
  {
    value: "mtd",
    label: "Month to date",
    helperText: "April 15-20",
    chip: {
      label: "Processing",
      size: "small",
      variant: "filled",
    },
  },
  {
    value: "lastMonth",
    label: "Last month",
    chip: {
      label: "Storage limit",
      size: "small",
      variant: "filled",
    },
  },
];

export function Timepicker({ value, onChange }: TimepickerProps) {
  return (
    <Select
      className="mdai-timepicker"
      label="Time range"
      selected={value}
      onChange={onChange}
      options={initialOptions}
      size="small"
    />
  );
}
