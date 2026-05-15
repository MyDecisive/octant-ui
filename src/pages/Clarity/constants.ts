import { ProgressLineWithLabel } from "@components/ProgressLineWithLabel";
import { createColumnDefinitionsForDataTable } from "@components/Table/createColumnDefinitionsForDataTable";
import type { GridColDef } from "@mui/x-data-grid";
import type { BaseRowDefinition } from "@types";
import { createElement } from "react";

function roundNumber(value: number, decimalPlaces = 0) {
  const factor = 10 ** decimalPlaces;
  return Math.round(value * factor) / factor;
}

export function formatNumber(value: number | undefined) {
  if (value === undefined) {
    return "-";
  }

  return roundNumber(value).toLocaleString();
}

function formatNumberWithDecimals(
  value: number | undefined,
  decimalPlaces: number,
) {
  if (value === undefined) {
    return "-";
  }

  return roundNumber(value, decimalPlaces).toLocaleString();
}

function formatCurrency(value: number | undefined) {
  if (value === undefined) {
    return "-";
  }

  return `$${formatNumber(value)}`;
}

function formatPercent(value: number | undefined) {
  if (value === undefined) {
    return "-";
  }

  return `${formatNumber(value)} %`;
}

export const traceColumns = createColumnDefinitionsForDataTable<SpanData>([
  {
    headerName: "Root spans",
    field: "span",
  },
  {
    headerName: "Span breadth",
    field: "breadth",
    valueFormatter: formatNumber,
  },
  {
    headerName: "Invocations",
    field: "invocations",
    valueFormatter: formatNumber,
  },
  {
    headerName: "Span depth",
    field: "depth",
    valueFormatter: formatNumber,
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
    valueFormatter: formatNumber,
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
  if (value === undefined) {
    return "-";
  }
  return `${formatNumber(value)} ${type === "logs" ? "GB" : "MM Events"}`;
}

function summaryRateFormatter(
  value: number | undefined,
  { type }: SummaryData,
) {
  if (value === undefined) {
    return "-";
  }
  return `$${formatNumberWithDecimals(value, 2)}/${type === "logs" ? "GB" : "MM Events"}`;
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
    valueFormatter: formatPercent,
  },
  {
    headerName: "Est. Cost",
    headerClassName: "bold",
    field: "cost",
    valueFormatter: formatCurrency,
    cellClassName: "bold",
  },
] as GridColDef<SummaryData>[]);
