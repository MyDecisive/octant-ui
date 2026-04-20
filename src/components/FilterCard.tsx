import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { StatusChip } from "./StatusChip";

import type { FilterStatus } from "@types";
import "./FilterCard.css";
import { SimpleFilterControl } from "./SimpleFilterControl";

interface FilterCardProps {
  title: string;
  status: FilterStatus;
  helperText?: string;
  received: number;
  sent: number;
  filtered: number;
  unit: string;
  volumeFilter?: number;
  persistErrors?: boolean;
}

export function FilterCard({
  title,
  helperText,
  status,
  received,
  sent,
  filtered,
  volumeFilter,
  persistErrors,
  unit,
}: FilterCardProps) {
  return (
    <Stack gap={0.75} className="filter-card-container">
      <Stack
        className="filter-card-title-row"
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
      >
        <Typography variant="h5">{title}</Typography>
        {helperText && (
          <Tooltip title={helperText} placement="right" arrow>
            <HelpOutlineRoundedIcon
              className="filter-card-title-row-helper-text-target"
              fontSize="small"
            />
          </Tooltip>
        )}
        <StatusChip status={status} className="filter-card-status-chip" />
      </Stack>
      <MetricRow label={"Received"} value={received.toString()} unit={unit} />
      <MetricRow label={"Sent"} value={sent.toString()} unit={unit} />
      <MetricRow label={"Filtered"} value={filtered.toString()} unit={unit} />
      <SimpleFilterControl
        volumeFilter={volumeFilter}
        persistErrors={persistErrors}
      />
    </Stack>
  );
}

function MetricRow({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <Stack
      className="filter-card-metric-row"
      direction={"row"}
      justifyContent={"flex-end"}
      alignItems={"flex-end"}
    >
      <Typography variant="chipLabel" className="filter-card-metric-row-label">
        {label}
      </Typography>
      <Typography variant="h4">{value}</Typography>
      <Typography
        className="filter-card-metric-row-unit"
        color="secondary"
        variant="chipLabel"
      >
        {unit}
      </Typography>
    </Stack>
  );
}
