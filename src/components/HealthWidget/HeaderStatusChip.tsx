import Chip, { type ChipProps } from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";

function chipPropsFromStatus(
  status: "error" | "operational" | "loading",
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

export function HeaderStatusChip({
  status,
}: {
  status: "error" | "operational" | "loading";
}) {
  const chipProps = chipPropsFromStatus(status);
  return <Chip variant="filled" size="small" {...chipProps} />;
}
