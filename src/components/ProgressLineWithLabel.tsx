import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import "./ProgressLineWithLabel.css";

interface ProgressLineWithLabelProps {
  value: number;
  showLabel?: boolean;
}

export function ProgressLineWithLabel({
  value,
  showLabel,
}: ProgressLineWithLabelProps) {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={1}
      className={"progress-line-with-label-container"}
    >
      <Box sx={{ width: "100%" }}>
        <LinearProgress color="secondary" variant="determinate" value={value} />
      </Box>
      {showLabel && (
        <Box sx={{ minWidth: 35 }}>
          <Typography
            variant="body2"
            color="secondary"
          >{`${Math.round(value)}%`}</Typography>
        </Box>
      )}
    </Stack>
  );
}
