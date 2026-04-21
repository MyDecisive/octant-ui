import type { GridColDef } from "@mui/x-data-grid";

export const baseColumn: Partial<GridColDef> = {
  flex: 2,
  cellClassName: "mdai-table-cell",
  headerClassName: "mdai-table-header-cell",
  align: "left",
  headerAlign: "left",
  type: "string",
};
