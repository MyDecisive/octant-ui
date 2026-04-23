import { createColumnDefinitionsForDataTable } from "@components/Table/createColumnDefinitionsForDataTable";
import type { GridColDef } from "@mui/x-data-grid";
import type { BaseRowDefinition } from "@types";

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
  // {
  //   headerName: "% of Total",
  //   field: "percent",
  //   renderCell: ({ value }) => (
  //     <ProgressLineWithLabel value={value} showLabel />
  //   ),
  // },
  // {
  //   headerName: "Estimated cost",
  //   field: "cost",
  //   cellClassName: "bold",
  //   valueFormatter: (value: number) => `$${value.toLocaleString()}`,
  //   align: "right",
  //   headerAlign: "right",
  // },
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
export interface SummaryData extends BaseRowDefinition {
  type: "logs" | "traces";
  cost: number;
  received: number;
  sent: number;
  rate: number;
  percent: number;
}

function summaryValueFormatter(value: number, { type }: SummaryData) {
  return `${value.toLocaleString()} ${type === "logs" ? "GB" : "MM Events"}`;
}

function summaryRateFormatter(value: number, { type }: SummaryData) {
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
    headerName: "Received",
    headerClassName: "bold",
    field: "received",
    valueFormatter: summaryValueFormatter,
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
    field: "percent",
    valueFormatter: (value: number) => `${value} %`,
  },
  {
    headerName: "Est. Cost",
    headerClassName: "bold",
    field: "cost",
    valueFormatter: (value: number) => `$${value}`,
    cellClassName: "bold",
  },
] as GridColDef<SummaryData>[]);

export const summaryData: SummaryData[] = [
  {
    id: "logs",
    type: "logs",
    cost: 700,
    received: 100,
    sent: 100,
    rate: 0.1,
    percent: 70,
  },
  {
    id: "traces",
    type: "traces",
    cost: 300,
    received: 4.2,
    sent: 4.2,
    rate: 1.27,
    percent: 30,
  },
];
