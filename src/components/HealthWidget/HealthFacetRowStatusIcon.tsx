import type { HealthFacetRowProps } from "@app-types/components";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircularProgress from "@mui/material/CircularProgress";

export function HealthFacetRowStatusIcon({
  health,
  loading,
}: Pick<HealthFacetRowProps, "health" | "loading">) {
  if (loading) {
    return <CircularProgress size="1rem" color="secondary" />;
  }
  if (health) {
    return <CheckCircleIcon color="success" />;
  }

  return <CancelIcon color="error" />;
}
