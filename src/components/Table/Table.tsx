import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid, type DataGridProps } from "@mui/x-data-grid";
import type { BaseRowDefinition } from "@types";
import classNames from "classnames";
import type { ReactNode } from "react";
import { SummaryTableToolbar } from "./SummaryTableToolbar";
import "./Table.css";
import { TableFooter } from "./TableFooter";
import { TableToolbar } from "./TableToolbar";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    label: string;
    total: number;
  }
  interface FooterPropsOverrides {
    total?: number;
    label: string;
    hideFooterPagination?: boolean;
  }
}

interface TableProps<T extends BaseRowDefinition> extends Omit<
  DataGridProps,
  "rows" | "columns" | "label"
> {
  rows: T[];
  columns: GridColDef<T>[];
  label?: string;
  header?: ReactNode;
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
  header,
  footerLabel,
  hideFooterPagination,
  footerClassName,
  summaryTable,
  className,
  calculateTotal,
  ...rest
}: TableProps<T>) {
  const total = calculateTotal ? calculateTotal(rows) : undefined;
  return (
    <Card className={classNames("mdai-table-container", className)}>
      {header && <CardHeader title={header} />}
      <DataGrid
        className={classNames("mdai-table", { "summary-table": summaryTable })}
        autoHeight
        disableRowSelectionOnClick
        slots={{
          toolbar: summaryTable ? SummaryTableToolbar : TableToolbar,
          footer: summaryTable ? undefined : TableFooter,
        }}
        slotProps={{
          toolbar: {
            label,
            total,
          },
          footer: {
            hideFooterPagination,
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
        hideFooter={summaryTable}
        {...rest}
      />
    </Card>
  );
}
