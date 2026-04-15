import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useState, type Dispatch, type SetStateAction } from "react";
import { columns, initialRows } from "./constants";
import "./DataFidelityTable.css";
import { DataFidelityTableFooter } from "./DataFidelityTableFooter";
import type { RowType } from "./types";

declare module "@mui/x-data-grid" {
  interface FooterPropsOverrides {
    setRows: Dispatch<SetStateAction<RowType[]>>;
    setIsValid: Dispatch<SetStateAction<boolean>>;
  }
}

export function DataFidelityTable({
  setIsValid,
}: {
  setIsValid: Dispatch<SetStateAction<boolean>>;
}) {
  const [rows, setRows] = useState<RowType[]>(initialRows);

  return (
    <Box>
      <DataGrid
        className="data-fidelity-table"
        autoHeight
        density="compact"
        disableAutosize
        disableColumnFilter
        disableColumnMenu
        disableColumnResize
        disableColumnSorting
        disableRowSelectionOnClick
        hideFooterSelectedRowCount
        hideFooterPagination
        rows={rows}
        columns={columns}
        slots={{
          footer: DataFidelityTableFooter,
        }}
        slotProps={{
          footer: {
            setRows,
            setIsValid,
          },
        }}
      />
    </Box>
  );
}
