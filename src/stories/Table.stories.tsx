import type { Meta, StoryObj } from "@storybook/react-vite";
import type { BaseRowDefinition } from "@types";
import { ProgressLineWithLabel } from "../components/ProgressLineWithLabel";
import { createColumnDefinitions } from "../components/Table/createColumnDefinitions";
import { Table } from "../components/Table/Table";

const meta = {
  title: "Display/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  args: {},
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

const traceColumns = createColumnDefinitions([
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

interface SpanData extends BaseRowDefinition {
  span: string;
  breadth: number;
  invocations: number;
  depth: number;
  cost: number;
}

function createDummySpanData() {
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

export const Traces: Story = {
  args: {
    label: "Traces - Top Talkers",
    columns: traceColumns,
    rows: createDummySpanData(),
    showToolbar: true,
    footerLabel: "Total estimated cost",
    calculateTotal: (rows) =>
      rows.reduce((sum, r) => sum + (r as SpanData).cost, 0),
  },
};

interface LogData extends BaseRowDefinition {
  name: string;
  sent: number;
  percent: number;
  cost: number;
}

const logsColumns = createColumnDefinitions([
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
    renderCell: ({ value }) => (
      <ProgressLineWithLabel value={value as number} showLabel />
    ),
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

function createDummyLogData() {
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

export const Logs: Story = {
  args: {
    label: "Logs - Top Talkers",
    columns: logsColumns,
    rows: createDummyLogData(),
    showToolbar: true,
    footerLabel: "Total estimated cost",
    calculateTotal: (rows) =>
      rows.reduce((sum, r) => sum + (r as LogData).cost, 0),
  },
};
