import Chip, { type ChipProps } from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const chipProps: Partial<ChipProps> = {
  size: "small",
  variant: "filled",
  clickable: false,
};

export function FilterCardTitle({
  title,
  persistErrors,
  volumeFilter,
}: {
  volumeFilter?: number;
  persistErrors?: boolean;
  title: string;
}) {
  return (
    <Stack direction={"row"} alignItems={"center"} gap={2}>
      <Typography variant="body1">{title}</Typography>
      <Stack direction={"row"} alignItems={"center"} gap={1}>
        {persistErrors == null && volumeFilter == null && (
          <Chip label="None applied" disabled {...chipProps} />
        )}
        {persistErrors && (
          <Chip label={"Keep errors"} color="success" {...chipProps} />
        )}
        {volumeFilter != null && (
          <Chip
            label={`${volumeFilter.toLocaleString()}%`}
            color="success"
            {...chipProps}
          />
        )}
      </Stack>
    </Stack>
  );
}
