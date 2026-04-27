import { FilterCard } from "@components/FilterCard/FilterCard";
import { Table } from "@components/Table/Table";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import "./Clarity.css";
import {
  createDummyLogData,
  createDummySpanData,
  logsColumns,
  summaryColumns,
  summaryData,
  traceColumns,
  type LogData,
  type SpanData,
  type SummaryData,
} from "./constants";

export function ClarityPage() {
  return (
    <Box className="main-content-container">
      <Stack gap={3} className="left-column">
        <Table<SummaryData>
          label={"Overall Estimated Cost"}
          columns={summaryColumns}
          rows={summaryData}
          showToolbar
          footerLabel={"the last 24h"}
          calculateTotal={(rows) => rows.reduce((sum, r) => sum + r.cost, 0)}
          summaryTable
        />
        <Stack gap={1}>
          <Table<LogData>
            label={"Logs - Top Talkers"}
            columns={logsColumns}
            rows={createDummyLogData()}
            showToolbar
            footerLabel={"Total estimated cost"}
            calculateTotal={(rows) => rows.reduce((sum, r) => sum + r.cost, 0)}
          />
          <Table<SpanData>
            label={"Traces - Top Talkers"}
            columns={traceColumns}
            rows={createDummySpanData()}
            showToolbar
            footerLabel={"Total estimated cost"}
            calculateTotal={(rows) => rows.reduce((sum, r) => sum + r.cost, 0)}
          />
        </Stack>
      </Stack>
      <Stack className="right-column" gap={1}>
        <FilterCard
          title={"Log filters"}
          unit={"GB"}
          received={100}
          sent={50}
          filtered={50}
        />
        <FilterCard
          title={"Traces filters"}
          unit={"MM Spans"}
          received={100}
          sent={50}
          filtered={50}
        />
      </Stack>
    </Box>
  );
}
