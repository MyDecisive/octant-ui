import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FixCard, type FixInfo } from "./FixCard";

export interface HealthFacet {
  label: string;
  health: boolean;
  fix?: FixInfo;
}

export function HealthFacetRow({ label, health, fix }: HealthFacet) {
  return (
    <Stack className="health-facet-row-container" gap={1.25}>
      <Stack
        className="health-facet-row-label-row-container"
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography className="health-facet-row-label">{label}</Typography>
        {health ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        )}
      </Stack>
      {fix && <FixCard {...fix} />}
    </Stack>
  );
}
