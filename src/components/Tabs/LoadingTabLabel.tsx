import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import "./LoadingTabLabel.css";

interface LoadingTabLabelProps {
  label: string;
  loading?: boolean;
}

export function LoadingTabLabel({
  label,
  loading = false,
}: LoadingTabLabelProps) {
  return (
    <Stack
      component="span"
      direction="row"
      alignItems="center"
      gap={1}
    >
      {loading && <CircularProgress color="inherit" size={16} />}
      <Typography className="loading-tab-label-text" component="span">
        {label}
      </Typography>
    </Stack>
  );
}
