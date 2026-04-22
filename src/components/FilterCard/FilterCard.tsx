import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Accordion } from "@components/Accordion";
import { Switch } from "@mui/material";
import type { FilterStatus } from "@types";
import { SliderControl } from "../formInputs/SliderControl";
import "./FilterCard.css";
import { FilterCardTitle } from "./FilterCardTitle";
import { MetricRow } from "./MetricRow";

interface FilterCardProps {
  title: string;
  status: FilterStatus;
  received: number;
  sent: number;
  filtered: number;
  unit: string;
  volumeFilter?: number;
  persistErrors?: boolean;
}

export function FilterCard({
  title,
  received,
  sent,
  filtered,
  volumeFilter,
  persistErrors,
  unit,
}: FilterCardProps) {
  return (
    <Accordion
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
            value={volumeFilter ?? 0}
            label="Reduce log volume by"
            valueUnits="%"
            size="small"
          />
          <Divider />
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="chipLabel">Always keep errors</Typography>
            <Switch value={persistErrors} />
          </Stack>
          <Divider />
          <Stack
            className="filter-widget-button-container"
            direction={"row"}
            gap={1}
            justifyContent={"flex-end"}
          >
            <Button variant="text" color="inherit" size="small">
              Cancel
            </Button>
            <Button variant="text" size="small">
              Apply
            </Button>
          </Stack>
        </Stack>
      }
    />
  );
}
