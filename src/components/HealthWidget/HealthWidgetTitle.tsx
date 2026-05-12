import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { HeaderStatusChip } from "./HeaderStatusChip";
import type { HealthWidgetProps } from "./HealthWidget";

export function HealthWidgetTitle({
  title,
  status,
}: Pick<HealthWidgetProps, "title" | "status">) {
  return (
    <Stack
      className="health-widget-title-container"
      justifyContent={"space-between"}
      alignContent={"center"}
      direction={"row"}
    >
      <Typography variant="body1" bold>
        {title}
      </Typography>
      <HeaderStatusChip status={status} />
    </Stack>
  );
}
