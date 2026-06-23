import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState, type ChangeEventHandler } from "react";

import { Accordion } from "@components/Accordion";
import { SliderControl } from "@components/formInputs/SliderControl";
import { Switch } from "@mui/material";
import { ClarityCopy } from "../../../copy/clarity/Clarity.copy";
import { MetricRow } from "./MetricRow";
import "./RatioFilterControl.css";
import { RationFilterControlTitle } from "./RatioFilterControlTitle";

interface RatioFilterControlProps {
  title: string;
  defaultExpanded?: boolean;
  received?: number;
  sent?: number;
  filtered?: number;
  unit: string;
  pctSampled?: number;
  includeErr?: boolean;
  loading?: boolean;
  onApplyFilter: (pctSampled: number, includeErr: boolean) => Promise<void>;
}

export function RatioFilterControl({
  title,
  defaultExpanded,
  received,
  sent,
  filtered,
  pctSampled,
  loading,
  includeErr,
  unit,
  onApplyFilter,
}: RatioFilterControlProps) {
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
      className="ratio-filter-control-container"
      defaultExpanded={defaultExpanded}
      title={
        <RationFilterControlTitle
          title={title}
          pctSampled={pctSampled}
          includeErr={includeErr}
        />
      }
      content={
        <Stack gap={2}>
          <Stack gap={1}>
            <MetricRow
              label={ClarityCopy.filterCard.rows.ingested}
              value={received}
              unit={unit}
            />
            <MetricRow
              label={ClarityCopy.filterCard.rows.routed}
              value={sent}
              unit={unit}
            />
            <MetricRow
              label={ClarityCopy.filterCard.rows.dropped}
              value={filtered}
              unit={unit}
            />
          </Stack>
          <Divider />
          <SliderControl
            value={sampleRate}
            label={ClarityCopy.filterCard.slider}
            valueUnits="%"
            size="small"
            onChange={handleRateChange}
          />
          <Divider />
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="chipLabel">
              {ClarityCopy.filterCard.toggle}
            </Typography>
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
              {ClarityCopy.filterCard.ctas.cancel}
            </Button>
            <Button
              disabled={noValueHasBeenChanged}
              loading={loading}
              onClick={handleApply}
              variant="text"
              size="small"
            >
              {ClarityCopy.filterCard.ctas.apply}
            </Button>
          </Stack>
        </Stack>
      }
    />
  );
}
