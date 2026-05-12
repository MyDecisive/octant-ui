import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FixCard, type FixInfo } from "./FixCard";
import { HealthFacetRowStatusIcon } from "./HealthFacetRowStatusIcon";

export interface HealthFacet {
  label: string;
  health?: boolean;
  loading?: boolean;
  fix?: FixInfo;
}

export function HealthFacetRow({ label, health, fix, loading }: HealthFacet) {
  return (
    <Stack className="health-facet-row-container" gap={1.25}>
      <Stack
        className="health-facet-row-label-row-container"
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography className="health-facet-row-label">{label}</Typography>
        <HealthFacetRowStatusIcon health={health} loading={loading} />
      </Stack>
      {fix && <FixCard {...fix} />}
    </Stack>
  );
}
