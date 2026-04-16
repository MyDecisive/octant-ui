import CircularProgress from "@mui/material/CircularProgress";

export function DetailsCell({ value }: { value: null | string }) {
  if (value == null || value == "") {
    return "-";
  }
  if (value === "loading") {
    return <CircularProgress size="1rem" color="secondary" />;
  }
  return <>{value}</>;
}
