import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function MetricRow({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
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
      <Typography variant="body1">{value}</Typography>
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
