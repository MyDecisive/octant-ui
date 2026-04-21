import type { ColumnType } from "@types";

export const baseColumn: Partial<ColumnType> = {
  flex: 2,
  cellClassName: "mdai-table-cell",
  headerClassName: "mdai-table-header-cell",
  align: "left",
  headerAlign: "left",
  type: "string",
};
