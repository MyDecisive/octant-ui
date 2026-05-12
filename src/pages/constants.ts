import { createColumnDefinitionsForDataTable } from "@components/Table/createColumnDefinitionsForDataTable";
import { ProgressLineWithLabel } from "@components/ProgressLineWithLabel";
import type { GridColDef } from "@mui/x-data-grid";
import type { BaseRowDefinition } from "@types";
import { createElement } from "react";

export const traceColumns = createColumnDefinitionsForDataTable<SpanData>([
  {
    headerName: "Root spans",
    field: "span",
  },
  {
    headerName: "Span breadth",
    field: "breadth",
  },
  {
    headerName: "Invocations",
    field: "invocations",
  },
  {
    headerName: "Span depth",
    field: "depth",
  },
  {
    headerName: "Estimated cost",
    field: "cost",
    cellClassName: "bold",
    valueFormatter: (value: number) => `$${value.toLocaleString()}`,
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

export function createDummySpanData() {
  const data: SpanData[] = [];

  for (let index = 0; index < 40; index++) {
    const row: SpanData = {
      id: `row-${index.toString()}`,
      span: `/Service${index.toString()}`,
      breadth: index % 10,
      invocations: index % 7,
      depth: index % 9,
      cost: index * Math.floor(Math.random() * 10),
    };
    data.push(row);
  }

  return data;
}

export const spanData = createDummySpanData();

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
    valueFormatter: (value: number) => `$${value.toLocaleString()}`,
    align: "right",
    headerAlign: "right",
  },
]);

export function createDummyLogData() {
  const data: LogData[] = [];

  for (let index = 0; index < 40; index++) {
    const row: LogData = {
      id: `row-${index.toString()}`,
      name: `service ${index.toString()}`,
      sent: index % 10,
      percent: Math.floor(Math.random() * 100),
      cost: index * Math.floor(Math.random() * 10),
    };
    data.push(row);
  }

  return data;
}

export const logData = createDummyLogData();

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
  return `${value.toLocaleString()} ${type === "logs" ? "GB" : "MM Events"}`;
}

function summaryRateFormatter(
  value: number | undefined,
  { type }: SummaryData,
) {
  if (value === undefined) {
    return "-";
  }
  return `$${value.toLocaleString()}/${type === "logs" ? "GB" : "MM Events"}`;
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
    valueFormatter: (value: number | undefined) => {
      if (value === undefined) {
        return "-";
      }
      return `${value} %`;
    },
  },
  {
    headerName: "Est. Cost",
    headerClassName: "bold",
    field: "cost",
    valueFormatter: (value: number | undefined) => {
      if (value === undefined) {
        return "-";
      }
      return `$${value}`;
    },
    cellClassName: "bold",
  },
] as GridColDef<SummaryData>[]);
