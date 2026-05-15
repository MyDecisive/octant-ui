import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "../components/Table/Table";
import {
  formatNumber,
  logsColumns,
  summaryColumns,
  traceColumns,
  type LogData,
  type SpanData,
  type SummaryData,
} from "../pages/Clarity/constants";

const meta = {
  title: "Display/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  args: {},
} satisfies Meta<typeof Table>;

export default meta;

type LogStory = StoryObj<Meta<typeof Table<LogData>>>;
type SpanStory = StoryObj<Meta<typeof Table<SpanData>>>;
type SummaryStory = StoryObj<Meta<typeof Table<SummaryData>>>;

function createDummySpanData() {
  const data: SpanData[] = [];

  for (let index = 0; index < 40; index++) {
    const row: SpanData = {
      id: `row-${index.toString()}`,
      span: `/Service-${index.toString()}`,
      breadth: 1.1234 + index * 0.3311,
      invocations: 125.9876 + index * 42.4321,
      depth: 2.8765 + (index % 9) * 0.2456,
      cost: 4.5678 + index * 1.2345,
    };
    data.push(row);
  }

  return data;
}

const spanRows = createDummySpanData();

export const Traces: SpanStory = {
  args: {
    label: "Traces - Top Talkers",
    columns: traceColumns,
    rows: spanRows,
    showToolbar: true,
    footerLabel: "Total estimated cost",
    total: formatNumber(spanRows.reduce((sum, { cost }) => sum + cost, 0)),
  },
};

function createDummyLogData() {
  const data: LogData[] = [];

  for (let index = 0; index < 40; index++) {
    const row: LogData = {
      id: `row-${index.toString()}`,
      name: `service-${index.toString()}`,
      sent: 12.3456 + index * 3.2109,
      percent: Math.min(100, 1.2345 + index * 2.3456),
      cost: 2.3456 + index * 0.9876,
    };
    data.push(row);
  }

  return data;
}

const logRows = createDummyLogData();

export const Logs: LogStory = {
  args: {
    label: "Logs - Top Talkers",
    columns: logsColumns,
    rows: logRows,
    showToolbar: true,
    footerLabel: "Total estimated cost",
    total: formatNumber(logRows.reduce((sum, { cost }) => sum + cost, 0)),
  },
};

const summaryData: SummaryData[] = [
  {
    id: "logs",
    type: "logs",
    cost: 87.9345,
    sent: 320.5678,
    rate: 0.2245,
    pct: 68.4567,
  },
  {
    id: "traces",
    type: "traces",
    cost: 40.4987,
    sent: 75.3344,
    rate: 0.5376,
    pct: 31.5432,
  },
];

export const Summary: SummaryStory = {
  args: {
    label: "Overall Estimated Cost",
    columns: summaryColumns,
    rows: summaryData,
    showToolbar: true,
    footerLabel: "the last 24h",
    total: formatNumber(
      summaryData.reduce((sum, { cost }) => sum + (cost ?? 0), 0),
    ),
    summaryTable: true,
  },
};
