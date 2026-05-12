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
  received?: number;
  sent?: number;
  filtered?: number;
  unit: string;
  pctSampled?: number;
  includeErr?: boolean;
  loading?: boolean;
  onApplyFilter: (pctSampled: number, includeErr: boolean) => Promise<void>;
}

export function FilterCard({
  title,
  received,
  sent,
  filtered,
  pctSampled,
  loading,
  includeErr,
  unit,
  onApplyFilter,
}: FilterCardProps) {
  const appliedSampleRate = pctSampled ?? 0;
  const appliedPersist = includeErr ?? false;
  const [sampleRate, setSampleRate] = useState(appliedSampleRate);
  const [persist, setPersist] = useState(appliedPersist);

  const handlePersistChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setPersist(e.target.checked);

  const handleRateChange: (
    event: React.SyntheticEvent | Event,
    value: number,
  ) => void = (_, value) => setSampleRate(value);

  const noValueHasBeenChanged =
    sampleRate === appliedSampleRate && persist === appliedPersist;

  const handleCancel = () => {
    setSampleRate(appliedSampleRate);
    setPersist(appliedPersist);
  };

  const handleApply = () => {
    void onApplyFilter(sampleRate, persist);
  };
  return (
    <Accordion
      className="filter-card-container"
      title={
        <FilterCardTitle
          title={title}
          pctSampled={pctSampled}
          includeErr={includeErr}
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
            <Switch checked={persist} onChange={handlePersistChange} />
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
              loading={loading}
              onClick={handleCancel}
              variant="text"
              color="inherit"
              size="small"
            >
              Cancel
            </Button>
            <Button
              disabled={noValueHasBeenChanged}
              loading={loading}
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
