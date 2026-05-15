import { ProgressLineWithLabel } from "@components/ProgressLineWithLabel";
import { createColumnDefinitionsForDataTable } from "@components/Table/createColumnDefinitionsForDataTable";
import type { GridColDef } from "@mui/x-data-grid";
import type { BaseRowDefinition } from "@types";
import { formatNumber } from "@utils/formatNumber";
import { createElement } from "react";

const formatCurrency = (value: number | undefined) =>
  formatNumber(value, { minimumDecimalPlaces: 2, prefix: "$" });
const formatMetricNumber = (value: number | undefined) => formatNumber(value);

export const traceColumns = createColumnDefinitionsForDataTable<SpanData>([
  {
    headerName: "Root spans",
    field: "span",
  },
  {
    headerName: "Span breadth",
    field: "breadth",
    valueFormatter: formatMetricNumber,
  },
  {
    headerName: "Invocations",
    field: "invocations",
    valueFormatter: formatMetricNumber,
  },
  {
    headerName: "Span depth",
    field: "depth",
    valueFormatter: formatMetricNumber,
  },
  {
    headerName: "Estimated cost",
    field: "cost",
    cellClassName: "bold",
    valueFormatter: formatCurrency,
    align: "right",
    headerAlign: "right",
  },
]);

export interface SpanData extends BaseRowDefinition {
  span: string;
  breadth: number;
  invocations: number;
  depth: number;
  cost: number;
}

export interface LogData extends BaseRowDefinition {
  name: string;
  sent: number;
  percent: number;
  cost: number;
}

export const logsColumns = createColumnDefinitionsForDataTable<LogData>([
  {
    headerName: "service name",
    field: "name",
  },
  {
    headerName: "Logs sent (GB)",
    field: "sent",
    type: "number",
    valueFormatter: formatMetricNumber,
  },
  {
    headerName: "% of Total",
    field: "percent",
    renderCell: ({ value }) =>
      createElement(ProgressLineWithLabel, {
        value: value as number,
        showLabel: true,
      }),
  },
  {
    headerName: "Estimated cost",
    field: "cost",
    cellClassName: "bold",
    valueFormatter: formatCurrency,
    align: "right",
    headerAlign: "right",
  },
]);

export interface SummaryData extends BaseRowDefinition {
  type: "logs" | "traces";
  cost: number | undefined;
  sent: number | undefined;
  rate: number | undefined;
  pct: number | undefined;
}

function summaryValueFormatter(
  value: number | undefined,
  { type }: SummaryData,
) {
  return formatNumber(value, {
    suffix: ` ${type === "logs" ? "GB" : "MM Events"}`,
  });
}

function summaryRateFormatter(
  value: number | undefined,
  { type }: SummaryData,
) {
  return formatNumber(value, {
    decimalPlaces: 2,
    minimumDecimalPlaces: 2,
    prefix: "$",
    suffix: `/${type === "logs" ? "GB" : "MM Events"}`,
  });
}

export const summaryColumns = createColumnDefinitionsForDataTable<SummaryData>([
  {
    headerName: "Type",
    field: "type",
    headerClassName: "bold",
    cellClassName: "bold",
    valueFormatter: (value: string) =>
      `${value[0].toLocaleUpperCase()}${value.slice(1)}`,
  },
  {
    headerName: "Sent",
    headerClassName: "bold",
    field: "sent",
    valueFormatter: summaryValueFormatter,
  },
  {
    headerName: "Rate",
    headerClassName: "bold",
    field: "rate",
    valueFormatter: summaryRateFormatter,
  },
  {
    headerName: "% of Total",
    headerClassName: "bold",
    field: "pct",
    valueFormatter: (value: number | undefined) =>
      formatNumber(value, { decimalPlaces: 0, suffix: " %" }),
  },
  {
    headerName: "Est. Cost",
    headerClassName: "bold",
    field: "cost",
    valueFormatter: formatCurrency,
    cellClassName: "bold",
  },
] as GridColDef<SummaryData>[]);
