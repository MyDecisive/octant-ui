import { FilterCard } from "@components/FilterCard/FilterCard";
import { Table } from "@components/Table/Table";
import { Tabs, type TabItem } from "@components/Tabs/Tabs";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
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

function rowMatchesSearch(row: LogData | SpanData, query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const serviceName = "name" in row ? row.name : row.span;

  return serviceName.toLocaleLowerCase().includes(normalizedQuery);
}

export function ClarityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("logs");
  const [searchLoading, setSearchLoading] = useState(false);
  const normalizedSearchQuery = searchQuery.trim();
  const filteredLogData = logData.filter((row) =>
    rowMatchesSearch(row, searchQuery),
  );
  const filteredSpanData = spanData.filter((row) =>
    rowMatchesSearch(row, searchQuery),
  );
  const showResultCounts = normalizedSearchQuery.length > 0;
  const searchOptions = [
    ...new Set([
      ...logData.map(({ name }) => name),
      ...spanData.map(({ span }) => span),
    ]),
  ];

  const tabs: TabItem[] = [
    {
      value: "logs",
      label: "Logs",
      resultCount: filteredLogData.length,
      children: (
        <Table<LogData>
          label={"Logs - Top Talkers"}
          columns={logsColumns}
          rows={filteredLogData}
          showToolbar
          footerLabel={"Total estimated cost"}
          calculateTotal={(rows) => rows.reduce((sum, r) => sum + r.cost, 0)}
        />
      ),
    },
    {
      value: "traces",
      label: "Traces",
      resultCount: filteredSpanData.length,
      children: (
        <Table<SpanData>
          label={"Traces - Top Talkers"}
          columns={traceColumns}
          rows={filteredSpanData}
          showToolbar
          footerLabel={"Total estimated cost"}
          calculateTotal={(rows) => rows.reduce((sum, r) => sum + r.cost, 0)}
        />
      ),
    },
  ];

  // Dummy data loading on search
  useEffect(() => {
    if (!searchLoading) return;

    const loadingTimeout = window.setTimeout(() => {
      setSearchLoading(false);
    }, 600);

    return () => {
      window.clearTimeout(loadingTimeout);
    };
  }, [searchLoading]);

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
        <Tabs
          activeValue={activeTab}
          items={tabs}
          loading={searchLoading}
          onChange={setActiveTab}
          search={{
            options: searchOptions,
            value: searchQuery,
            onChange: (nextSearchQuery) => {
              setSearchQuery(nextSearchQuery);
              setSearchLoading(nextSearchQuery.trim().length > 0);
            },
          }}
          showLoadingPopover
          showResultCounts={showResultCounts}
        />
      </Stack>
      <Stack className="right-column" gap={1}>
        <FilterCard
          onApplyFilter={(volume, persist) => {
            console.log("apply log filter changes ", { volume, persist });
          }}
          title={"Log filters"}
          unit={"GB"}
          received={100}
          sent={50}
          filtered={50}
        />
        <FilterCard
          onApplyFilter={(volume, persist) => {
            console.log("apply trace filter changes ", { volume, persist });
          }}
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
