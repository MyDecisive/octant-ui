import type { GridRenderCellParams } from "@mui/x-data-grid";
import { DetailsCell } from "./DetailsCell";
import { FidelityCell } from "./FidelityCell";
import type {
  DataFidelityCell,
  FidelityCellValues,
  FidelityDetailsCell,
  RowType,
} from "./types";

export function ValueCell(
  params: GridRenderCellParams<RowType, FidelityCellValues>,
) {
  const { id } = params;

  if (id === "details") {
    <DetailsCell
      {...(params as GridRenderCellParams<
        FidelityDetailsCell,
        FidelityCellValues
      >)}
    />;
  }

  return (
    <FidelityCell
      {...(params as GridRenderCellParams<
        DataFidelityCell,
        FidelityCellValues
      >)}
    />
  );
}
