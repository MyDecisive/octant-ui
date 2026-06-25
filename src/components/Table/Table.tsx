import type { BaseRowDefinition } from "@app-types/components";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid, type DataGridProps } from "@mui/x-data-grid";
import classNames from "classnames";
import type { ReactNode } from "react";
import "./Table.css";
import { TableFooter } from "./TableFooter";
import { TableToolbar, type TableToolbarTooltip } from "./TableToolbar";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    label: string;
    summaryTable?: boolean;
    tooltip?: TableToolbarTooltip;
    total: string;
    timeRangeLabel?: string;
  }
  interface FooterPropsOverrides {
    total?: string;
    label: string;
    hideFooterPagination?: boolean;
  }
}

export interface TableProps<T extends BaseRowDefinition> extends Omit<
  DataGridProps,
  "rows" | "columns" | "label"
> {
  rows: T[];
  columns: GridColDef<T>[];
  label?: string;
  header?: ReactNode;
  footerLabel?: string;
  footerClassName?: string;
  timeRangeLabel?: string;
  toolbarTooltip?: TableToolbarTooltip;
  total?: string;
  summaryTable?: boolean;
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
  timeRangeLabel,
  toolbarTooltip,
  total,
  ...rest
}: TableProps<T>) {
  return (
    <Card className={classNames("mdai-table-container", className)}>
      {header && <CardHeader title={header} />}
      <DataGrid
        className={classNames("mdai-table", { "summary-table": summaryTable })}
        autoHeight
        disableRowSelectionOnClick
        slots={{
          toolbar: TableToolbar,
          footer: summaryTable ? undefined : TableFooter,
        }}
        slotProps={{
          toolbar: {
            label,
            summaryTable,
            tooltip: toolbarTooltip,
            total,
            timeRangeLabel,
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
