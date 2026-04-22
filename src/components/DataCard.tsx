import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Fragment, type ReactNode } from "react";
import "./DataCard.css";

interface DataCardMetric {
  label?: string;
  value: number;
  unit: string;
}

interface DataCardProps {
  title: ReactNode;
  helperText?: string;
  // This should enforce length reqs for `metrics` prop
  metrics: [DataCardMetric] | [DataCardMetric, DataCardMetric];
}

export function DataCard({ title, helperText, metrics }: DataCardProps) {
  const isDouble = metrics.length === 2;
  return (
    <Stack gap={2} className="data-card-container">
      <Stack
        gap={1}
        direction={"row"}
        className="data-card-header"
        alignItems={"center"}
      >
        {title}
        {helperText && (
          <Tooltip title={helperText} placement="top" arrow>
            <HelpOutlineRoundedIcon color="secondary" />
          </Tooltip>
        )}
      </Stack>
      <Stack
        className="data-card-metrics-row"
        gap={2}
        direction={"row"}
        alignItems={"stretch"}
      >
        {metrics.map(({ label, value, unit }, index) => (
          <Fragment key={`${label}-${value}-${unit}-data-card-metric`}>
            <Stack
              className="data-card-metric-container"
              key={`${label}-${value}-${unit}-data-card-metric`}
              gap={1}
            >
              {label && <Typography variant="chipLabel">{label}</Typography>}
              <Stack gap={0.5} direction={"row"} alignItems={"flex-end"}>
                <Typography variant="metric">{value}</Typography>
                <Typography variant="chipLabel">{unit}</Typography>
              </Stack>
            </Stack>
            {isDouble && index === 0 && (
              <Divider
                orientation="vertical"
                flexItem
                className="data-card-metrics-row-divider"
              />
            )}
          </Fragment>
        ))}
      </Stack>
    </Stack>
  );
}
