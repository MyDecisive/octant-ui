import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircularProgress from "@mui/material/CircularProgress";

export function FidelityCell({ value }: { value: "loading" | boolean | null }) {
  if (value === false) {
    return <CancelIcon color="error" />;
  }
  if (value === true) {
    return <CheckCircleIcon color="success" />;
  }

  if (value === "loading") {
    return <CircularProgress size="1rem" color="secondary" />;
  }

  return "-";
}
