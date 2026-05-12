import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircularProgress from "@mui/material/CircularProgress";
import type { HealthFacet } from "./HealthFacetRow";

export function HealthFacetRowStatusIcon({
  health,
  loading,
}: Pick<HealthFacet, "health" | "loading">) {
  if (loading) {
    return <CircularProgress size="1rem" color="secondary" />;
  }
  if (health) {
    return <CheckCircleIcon color="success" />;
  }

  return <CancelIcon color="error" />;
}
