import Chip, { type ChipProps } from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const chipProps: Partial<ChipProps> = {
  size: "small",
  variant: "filled",
  clickable: false,
};

export function RationFilterControlTitle({
  title,
  includeErr,
  pctSampled,
}: {
  pctSampled?: number;
  includeErr?: boolean;
  title: string;
}) {
  return (
    <Stack direction={"row"} alignItems={"center"} gap={2}>
      <Typography variant="body1">{title}</Typography>
      <Stack direction={"row"} alignItems={"center"} gap={1}>
        {!includeErr && !pctSampled && (
          <Chip label="None applied" disabled {...chipProps} />
        )}
        {includeErr && (
          <Chip label={"Keep errors"} color="success" {...chipProps} />
        )}
        {pctSampled && (
          <Chip
            label={`${pctSampled.toLocaleString()}%`}
            color="success"
            {...chipProps}
          />
        )}
      </Stack>
    </Stack>
  );
}
