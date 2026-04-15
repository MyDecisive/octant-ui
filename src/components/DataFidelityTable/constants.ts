import type { GridColDef } from "@mui/x-data-grid";
import type { RowType } from "./types";
import { ValueCell } from "./ValueCell";

export const initialRows: RowType[] = [
  {
    id: "receivingData",
    label: "Receiving data",
    value: null,
  },
  {
    id: "sendingData",
    label: "Sending data",
    value: null,
  },
  {
    id: "dataIntegrity",
    label: "Data integrity",
    value: null,
  },
  {
    id: "details",
    label: "Details",
    value: null,
  },
];

const baseColumn: Partial<GridColDef<RowType>> = {
  flex: 2,
  cellClassName: "data-fidelity-table-cell",
  headerClassName: "data-fidelity-table-header-cell",
  align: "left",
  headerAlign: "left",
  type: "string",
};

export const columns: GridColDef<RowType>[] = [
  {
    ...baseColumn,
    field: "label",
    headerName: "Connection",
  },
  {
    ...baseColumn,
    field: "value",
    headerName: "Datadog",
    renderCell: ValueCell,
  },
];
