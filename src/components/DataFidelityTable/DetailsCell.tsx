import type { GridRenderCellParams } from "@mui/x-data-grid";
import type { FidelityDetailsCell } from "./types";

export function DetailsCell({
  value,
}: GridRenderCellParams<FidelityDetailsCell, unknown>) {
  if (value == null || value == "") {
    return "-";
  }

  return <>{value}</>;
}
