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
  className,
}: {
  status: keyof typeof statusPropsMap;
  className?: string;
}) {
  const statusProps = statusPropsMap[status];
  return (
    <Chip
      className={className}
      variant="outlined"
      clickable={false}
      {...statusProps}
    />
  );
}
