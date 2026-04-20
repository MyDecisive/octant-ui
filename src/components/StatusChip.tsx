import Chip from "@mui/material/Chip";

const statusPropsMap = {
  inactive: {
    label: "Not Active",
    color: "error",
  },
  updating: {
    label: "Updating",
    color: "info",
  },
  applied: {
    label: "Applied",
    color: "success",
  },
} as const;

export function StatusChip({
  status,
}: {
  status: keyof typeof statusPropsMap;
}) {
  const statusProps = statusPropsMap[status];
  return <Chip variant="outlined" clickable={false} {...statusProps} />;
}
