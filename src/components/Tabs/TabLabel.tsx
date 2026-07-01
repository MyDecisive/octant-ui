import type { TabLabelProps } from "@app-types/components";
import { RichTooltip } from "@components/RichTooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function TabLabel({
  text,
  loading = false,
  startIcon,
  endIcon,
  tooltip,
}: TabLabelProps) {
  const markup = (
    <Stack component="span" direction="row" alignItems="center" gap={1}>
      {loading ? <CircularProgress color="inherit" size={16} /> : startIcon}
      {/* {missingData && <WarningAmberRounded fontSize="small" />} */}
      <Typography color="inherit" component="span">
        {text}
      </Typography>
      {endIcon}
    </Stack>
  );

  if (tooltip) {
    return (
      <RichTooltip
        {...(typeof tooltip === "string" ? { description: tooltip } : tooltip)}
      >
        <span>{markup}</span>
      </RichTooltip>
    );
  }

  return markup;
}
