import type { LogData, SpanData, SummaryData } from "@app-types/components";
import { ProgressLineWithLabel } from "@components/ProgressLineWithLabel";
import { createColumnDefinitionsForDataTable } from "@components/Table/createColumnDefinitionsForDataTable";
import type { GridColDef } from "@mui/x-data-grid";
import { formatNumber } from "@utils/formatNumber";
import { createElement } from "react";
import { ClarityCopy } from "../../copy/clarity/Clarity.copy";

const formatCurrency = (value: number | undefined) =>
  formatNumber(value, { minimumDecimalPlaces: 2, prefix: "$" });
const formatMetricNumber = (value: number | undefined) => formatNumber(value);

export const traceColumns = createColumnDefinitionsForDataTable<SpanData>([
  {
    headerName: ClarityCopy.traceTable.columns.rootSpans,
    field: "span",
  },
  {
    headerName: ClarityCopy.traceTable.columns.spanBreadth,
    field: "breadth",
    valueFormatter: formatMetricNumber,
  },
  {
    headerName: ClarityCopy.traceTable.columns.invocations,
    field: "invocations",
    valueFormatter: formatMetricNumber,
  },
  {
    headerName: ClarityCopy.traceTable.columns.spanDepth,
    field: "depth",
    valueFormatter: formatMetricNumber,
  },
  {
    headerName: ClarityCopy.traceTable.columns.estimatedCost,
    field: "cost",
    cellClassName: "bold",
    valueFormatter: formatCurrency,
    align: "right",
    headerAlign: "right",
  },
]);

export const logsColumns = createColumnDefinitionsForDataTable<LogData>([
  {
    headerName: ClarityCopy.logsTable.columns.service,
    field: "name",
  },
  {
    headerName: ClarityCopy.logsTable.columns.sent,
    field: "sent",
    type: "number",
    valueFormatter: formatMetricNumber,
  },
  {
    headerName: ClarityCopy.logsTable.columns.pTotal,
    field: "percent",
    renderCell: ({ value }) =>
      createElement(ProgressLineWithLabel, {
        value: value as number,
        showLabel: true,
      }),
  },
  {
    headerName: ClarityCopy.logsTable.columns.estimatedCost,
    field: "cost",
    cellClassName: "bold",
    valueFormatter: formatCurrency,
    align: "right",
    headerAlign: "right",
  },
]);

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
    headerName: ClarityCopy.overall.columns.type,
    field: "type",
    headerClassName: "bold",
    cellClassName: "bold",
    valueFormatter: (value: string) =>
      `${value[0].toLocaleUpperCase()}${value.slice(1)}`,
  },
  {
    headerName: ClarityCopy.overall.columns.export,
    headerClassName: "bold",
    field: "sent",
    valueFormatter: summaryValueFormatter,
  },
  {
    headerName: ClarityCopy.overall.columns.rate,
    headerClassName: "bold",
    field: "rate",
    valueFormatter: summaryRateFormatter,
  },
  {
    headerName: ClarityCopy.overall.columns.pTotal,
    headerClassName: "bold",
    field: "pct",
    valueFormatter: (value: number | undefined) =>
      formatNumber(value, { decimalPlaces: 0, suffix: " %" }),
  },
  {
    headerName: ClarityCopy.overall.columns.total,
    headerClassName: "bold",
    field: "cost",
    valueFormatter: formatCurrency,
    cellClassName: "bold",
  },
] as GridColDef<SummaryData>[]);
