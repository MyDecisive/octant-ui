import Box from "@mui/material/Box";
import { DataGrid, type DataGridProps } from "@mui/x-data-grid";
import type { BaseRowDefinition, ColumnType } from "@types";
import "./Table.css";
import { TableFooter } from "./TableFooter";
import { TableToolbar } from "./TableToolbar";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    label: string;
  }
  interface FooterPropsOverrides {
    total?: number;
    label: string;
  }
}

interface TableProps<T extends BaseRowDefinition> extends Omit<
  DataGridProps,
  "rows" | "columns"
> {
  rows: T[];
  columns: ColumnType<T>[];
  label?: string;
  footerLabel?: string;
  calculateTotal?: (rows: T[]) => number;
}

export function Table<T extends BaseRowDefinition>({
  rows,
  columns,
  label,
  footerLabel,
  calculateTotal,
  ...rest
}: TableProps<T>) {
  const total = calculateTotal ? calculateTotal(rows) : undefined;
  return (
    <Box>
      <DataGrid
        className="mdai-table"
        autoHeight
        disableRowSelectionOnClick
        slots={{
          toolbar: TableToolbar,
          footer: TableFooter,
        }}
        slotProps={{
          toolbar: {
            label,
          },
          footer: {
            label: footerLabel,
            total,
          },
          basePagination: {
            className: "mdai-table-footer-pagination",
          },
        }}
        pagination
        pageSizeOptions={[1, 5, 10, 25]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        rows={rows}
        columns={columns}
        {...rest}
      />
    </Box>
  );
}
