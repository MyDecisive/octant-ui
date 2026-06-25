import type { HealthFacetRowProps } from "@app-types/components";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FixCard } from "./FixCard";
import { HealthFacetRowStatusIcon } from "./HealthFacetRowStatusIcon";

export function HealthFacetRow({
  label,
  health,
  fix,
  loading,
}: HealthFacetRowProps) {
  return (
    <Stack className="health-facet-row-container" gap={1.25}>
      <Stack
        className="health-facet-row-label-row-container"
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography className="health-facet-row-label">{label}</Typography>
        {health === undefined && loading === undefined ? (
          <Typography className="health-facet-row-label">-</Typography>
        ) : (
          <HealthFacetRowStatusIcon health={health} loading={loading} />
        )}
      </Stack>
      {fix && <FixCard {...fix} />}
    </Stack>
  );
}
