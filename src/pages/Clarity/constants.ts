import { ProgressLineWithLabel } from "@components/ProgressLineWithLabel";
import { createColumnDefinitionsForDataTable } from "@components/Table/createColumnDefinitionsForDataTable";
import type { GridColDef } from "@mui/x-data-grid";
import type { BaseRowDefinition } from "@types";
import { createElement } from "react";

interface FormatNumberOptions {
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
}

export function formatNumber(
  value: number | undefined,
  { decimalPlaces = 2, prefix = "", suffix = "" }: FormatNumberOptions = {},
) {
  if (value === undefined) {
    return "-";
  }

  const formattedValue = value.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
  return `${prefix}${formattedValue}${suffix}`;
}

const formatDecimalNumber = (value: number | undefined) => formatNumber(value);

export const traceColumns = createColumnDefinitionsForDataTable<SpanData>([
  {
    headerName: "Root spans",
    field: "span",
  },
  {
    headerName: "Span breadth",
    field: "breadth",
    valueFormatter: formatDecimalNumber,
  },
  {
    headerName: "Invocations",
    field: "invocations",
    valueFormatter: formatDecimalNumber,
  },
  {
    headerName: "Span depth",
    field: "depth",
    valueFormatter: formatDecimalNumber,
  },
  {
    headerName: "Estimated cost",
    field: "cost",
    cellClassName: "bold",
    valueFormatter: (value: number | undefined) =>
      formatNumber(value, { prefix: "$" }),
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
    valueFormatter: formatDecimalNumber,
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
    valueFormatter: (value: number | undefined) =>
      formatNumber(value, { prefix: "$" }),
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
    valueFormatter: (value: number | undefined) =>
      formatNumber(value, { prefix: "$" }),
    cellClassName: "bold",
  },
] as GridColDef<SummaryData>[]);
