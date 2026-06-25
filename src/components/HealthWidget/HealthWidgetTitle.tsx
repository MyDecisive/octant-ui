import type { HealthWidgetProps } from "@app-types/components";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { HeaderStatusChip } from "./HeaderStatusChip";

export function HealthWidgetTitle({
  title,
  timestamp,
  status,
}: Pick<HealthWidgetProps, "title" | "timestamp" | "status">) {
  return (
    <Stack
      className="health-widget-title-container"
      justifyContent={"space-between"}
      alignItems={"center"}
      direction={"row"}
    >
      <Stack>
        <Typography variant="body1" data-bold="true">
          {title}
        </Typography>
        {timestamp && <Typography variant="caption">{timestamp}</Typography>}
      </Stack>
      {status && <HeaderStatusChip status={status} />}
    </Stack>
  );
}
