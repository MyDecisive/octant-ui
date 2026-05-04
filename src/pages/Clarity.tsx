import { FilterCard } from "@components/FilterCard/FilterCard";
import { SearchField } from "@components/SearchField";
import { Table } from "@components/Table/Table";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import "./Clarity.css";
import {
  logData,
  logsColumns,
  spanData,
  summaryColumns,
  summaryData,
  traceColumns,
  type LogData,
  type SpanData,
  type SummaryData,
} from "./constants";

function rowMatchesSearch<T extends LogData | SpanData>(row: T, query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return Object.values(row).some((value) =>
    String(value).toLocaleLowerCase().includes(normalizedQuery),
  );
}

export function ClarityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredLogData = logData.filter((row) =>
    rowMatchesSearch(row, searchQuery),
  );
  const filteredSpanData = spanData.filter((row) =>
    rowMatchesSearch(row, searchQuery),
  );
  const searchOptions = [
    ...new Set([
      ...logData.map(({ name }) => name),
      ...spanData.map(({ span }) => span),
    ]),
  ];

  return (
    <Box className="main-content-container">
      <Stack gap={3} className="left-column">
        <SearchField
          options={searchOptions}
          value={searchQuery}
          onChange={setSearchQuery}
        />
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
            rows={filteredLogData}
            showToolbar
            footerLabel={"Total estimated cost"}
            calculateTotal={(rows) => rows.reduce((sum, r) => sum + r.cost, 0)}
          />
          <Table<SpanData>
            label={"Traces - Top Talkers"}
            columns={traceColumns}
            rows={filteredSpanData}
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
