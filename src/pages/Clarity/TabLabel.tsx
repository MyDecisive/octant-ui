import { HoverPopover } from "@components/Tabs/HoverPopover";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import "./TabLabel.css";

interface TabLabelProps {
  label: string;
  loading?: boolean;
  missingData?: boolean;
  resultCount?: number;
  showResultCounts?: boolean;
}

function formatLabel({
  label,
  resultCount,
  showResultCounts = false,
}: Pick<TabLabelProps, "label" | "resultCount" | "showResultCounts">) {
  if (showResultCounts && resultCount !== undefined) {
    return `${label} (${resultCount.toString()})`;
  }

  return label;
}

export function TabLabel({
  label,
  loading = false,
  missingData = false,
  resultCount,
  showResultCounts = false,
}: TabLabelProps) {
  const labelMarkup = (
    <Stack component="span" direction="row" alignItems="center" gap={1}>
      {loading && <CircularProgress color="inherit" size={16} />}
      {missingData && <WarningAmberRounded fontSize="small" />}
      <Typography className="tab-label-text" component="span">
        {formatLabel({ label, resultCount, showResultCounts })}
      </Typography>
    </Stack>
  );

  if (!loading) {
    return labelMarkup;
  }

  return (
    <HoverPopover message={"Data is still loading"}>{labelMarkup}</HoverPopover>
  );
}
