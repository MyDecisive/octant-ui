import Box from "@mui/material/Box";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid, type DataGridProps } from "@mui/x-data-grid";
import type { BaseRowDefinition } from "@types";
import classNames from "classnames";
import { SummaryTableFooter } from "./SummaryTableFooter";
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
    hideFooterPagination?: boolean;
  }
}

interface TableProps<T extends BaseRowDefinition> extends Omit<
  DataGridProps,
  "rows" | "columns"
> {
  rows: T[];
  columns: GridColDef<T>[];
  label?: string;
  footerLabel?: string;
  footerClassName?: string;
  summaryTable?: boolean;
  calculateTotal?: (rows: T[]) => number;
}

const paginationProps: Pick<
  DataGridProps,
  "pagination" | "pageSizeOptions" | "initialState"
> = {
  pagination: true,
  pageSizeOptions: [1, 5, 10, 25],
  initialState: {
    pagination: {
      paginationModel: { pageSize: 10, page: 0 },
    },
  },
};

export function Table<T extends BaseRowDefinition>({
  rows,
  columns,
  label,
  footerLabel,
  hideFooterPagination,
  footerClassName,
  summaryTable,
  calculateTotal,
  ...rest
}: TableProps<T>) {
  const total = calculateTotal ? calculateTotal(rows) : undefined;
  return (
    <Box>
      <DataGrid
        className={classNames("mdai-table", { "summary-table": summaryTable })}
        autoHeight
        disableRowSelectionOnClick
        slots={{
          toolbar: TableToolbar,
          footer: summaryTable ? SummaryTableFooter : TableFooter,
        }}
        slotProps={{
          toolbar: {
            label,
          },
          footer: {
            hideFooterPagination: summaryTable ?? hideFooterPagination,
            label: footerLabel,
            total,
            className: footerClassName,
          },
          basePagination: {
            className: "mdai-table-footer-pagination",
          },
        }}
        {...((summaryTable ?? hideFooterPagination) ? {} : paginationProps)}
        rows={rows}
        columns={columns}
        {...rest}
      />
    </Box>
  );
}
