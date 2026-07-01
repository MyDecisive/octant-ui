import type { LogData, SpanData, SummaryData } from "@app-types/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "../components/Table/Table";
import {
  logsColumns,
  summaryColumns,
  traceColumns,
} from "../pages/Clarity/constants";
import { formatNumber } from "../utils/formatNumber";

const tooltipPlacementOptions = [
  "bottom",
  "bottom-end",
  "bottom-start",
  "left",
  "left-end",
  "left-start",
  "right",
  "right-end",
  "right-start",
  "top",
  "top-end",
  "top-start",
];

const meta = {
  title: "Display/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    "toolbarTooltip.placement": {
      control: "select",
      options: tooltipPlacementOptions,
    },
  } as Record<string, unknown>,
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
    toolbarTooltip: {
      body: "Showing top 250 results. Refine your search to narrow down results.",
      placement: "right",
    },
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
    toolbarTooltip: {
      body: "Showing top 250 results. Refine your search to narrow down results.",
      placement: "right",
    },
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
    toolbarTooltip: {
      header: "Estimated data charges is based on average rates",
      body: "This also reflects only the data sent to this hub. Your total costs may be higher.",
      cta: "See full production costs",
      ctaHref: "https://docs.mydecisive.ai/",
      ctaExternal: true,
      placement: "bottom",
    },
    total: formatNumber(
      summaryData.reduce((sum, { cost }) => sum + (cost ?? 0), 0),
    ),
    summaryTable: true,
  },
};
