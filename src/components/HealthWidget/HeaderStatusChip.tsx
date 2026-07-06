import type { HealthWidgetStatus } from "@app-types/components";
import Chip, { type ChipProps } from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";

function chipPropsFromStatus(
  status: HealthWidgetStatus,
): Pick<ChipProps, "color" | "label" | "icon"> {
  switch (status) {
    case "error":
      return {
        color: "error",
        label: "Error",
      };
    case "operational":
      return {
        color: "success",
        label: "Operational",
      };
    case "loading":
      return {
        label: "Validating...",
        color: "default",
        icon: <CircularProgress size="1rem" color="secondary" />,
      };
  }
}

export function HeaderStatusChip({ status }: { status: HealthWidgetStatus }) {
  const chipProps = chipPropsFromStatus(status);
  return <Chip variant="filled" size="small" {...chipProps} />;
}
