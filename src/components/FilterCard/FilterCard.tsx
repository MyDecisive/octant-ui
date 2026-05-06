import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState, type ChangeEventHandler } from "react";

import { Accordion } from "@components/Accordion";
import { Switch } from "@mui/material";
import { SliderControl } from "../formInputs/SliderControl";
import "./FilterCard.css";
import { FilterCardTitle } from "./FilterCardTitle";
import { MetricRow } from "./MetricRow";

interface FilterCardProps {
  title: string;
  received: number;
  sent: number;
  filtered: number;
  unit: string;
  volumeFilter?: number;
  persistErrors?: boolean;
  onApplyFilter: (volumeFilter: number, persistErrors: boolean) => void;
}

export function FilterCard({
  title,
  received,
  sent,
  filtered,
  volumeFilter,
  persistErrors,
  unit,
  onApplyFilter,
}: FilterCardProps) {
  const [sampleRate, setSampleRate] = useState(volumeFilter ?? 0);
  const [persist, setPersist] = useState(persistErrors ?? false);

  const handlePersistChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setPersist(e.target.value === "true");

  const handleRateChange: (
    event: React.SyntheticEvent | Event,
    value: number,
  ) => void = (_, value) => setSampleRate(value);

  const noValueHasBeenChanged =
    sampleRate === volumeFilter || persist === persistErrors;

  const handleCancel = () => {
    setSampleRate(volumeFilter ?? 0);
    setPersist(persistErrors ?? false);
  };

  const handleApply = () => {
    onApplyFilter(sampleRate, persist);
  };

  return (
    <Accordion
      className="filter-card-container"
      title={
        <FilterCardTitle
          title={title}
          volumeFilter={volumeFilter}
          persistErrors={persistErrors}
        />
      }
      content={
        <Stack gap={2}>
          <Stack gap={1}>
            <MetricRow label={"Received"} value={received} unit={unit} />
            <MetricRow label={"Sent"} value={sent} unit={unit} />
            <MetricRow label={"Filtered"} value={filtered} unit={unit} />
          </Stack>
          <Divider />
          <SliderControl
            value={sampleRate}
            label="Reduce log volume by"
            valueUnits="%"
            size="small"
            onChangeCommitted={handleRateChange}
          />
          <Divider />
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="chipLabel">Always keep errors</Typography>
            <Switch value={persist} onChange={handlePersistChange} />
          </Stack>
          <Divider />
          <Stack
            className="filter-widget-button-container"
            direction={"row"}
            gap={1}
            justifyContent={"flex-end"}
          >
            <Button
              disabled={noValueHasBeenChanged}
              onClick={handleCancel}
              variant="text"
              color="inherit"
              size="small"
            >
              Cancel
            </Button>
            <Button
              disabled={noValueHasBeenChanged}
              onClick={handleApply}
              variant="text"
              size="small"
            >
              Apply
            </Button>
          </Stack>
        </Stack>
      }
    />
  );
}
