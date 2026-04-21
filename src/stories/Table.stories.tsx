import type { Meta, StoryObj } from "@storybook/react-vite";
import type { BaseRowDefinition } from "@types";
import { createColumnDefinitions } from "../components/Table/createColumnDefinitions";
import { Table } from "../components/Table/Table";

const meta = {
  title: "Display/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  args: {},
} satisfies Meta<typeof Table<SpanData>>;

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

export const Logs: Story = {
  args: {
    label: "Logs - Top Talkers",
    columns: traceColumns,
    rows: createDummySpanData(),
    showToolbar: true,
    footerLabel: "Total estimated cost",
    calculateTotal: (rows) =>
      rows.reduce((sum, r) => sum + (r as SpanData).cost, 0),
  },
};
