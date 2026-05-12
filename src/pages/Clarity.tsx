import { FilterCard } from "@components/FilterCard/FilterCard";
import { FilterEmptyStateCard } from "@components/FilterCard/FilterEmptyStateCard";
import { NoConnectionCard } from "@components/NoConnectionCard";
import { Table } from "@components/Table/Table";
import { Tabs, type TabItem } from "@components/Tabs/Tabs";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import type { Overall } from "@mydecisiveai/octant-client";
import { useOctantStore } from "@store/octantStore";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { timeframeLabels } from "../utils/timeframeToPickerOptions";
import "./Clarity.css";
import {
  logData,
  logsColumns,
  spanData,
  summaryColumns,
  traceColumns,
  type LogData,
  type SpanData,
  type SummaryData,
} from "./constants";
import { useManageClarityData } from "./useManageClarityData";
import { useManageFilters } from "./useManageFilters";

function rowMatchesSearch(row: LogData | SpanData, query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const serviceName = "name" in row ? row.name : row.span;

  return serviceName.toLocaleLowerCase().includes(normalizedQuery);
}

function overallDataToSummaryRows(data: Overall | null): SummaryData[] {
  return [
    {
      id: "logs",
      type: "logs",
      cost: data?.log?.cost,
      sent: data?.log?.sent,
      rate: data?.log?.costRate,
      pct: data?.log?.pct,
    },
    {
      id: "traces",
      type: "traces",
      cost: data?.trace?.cost,
      sent: data?.trace?.sent,
      rate: data?.trace?.costRate,
      pct: data?.trace?.pct,
    },
  ];
}

export function ClarityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("logs");
  const [searchLoading, setSearchLoading] = useState(false);
  const timeRangeLabel = useOctantStore(
    useShallow((state) => timeframeLabels[state.timeRange]),
  );
  const { logFilter, traceFilter } = useManageFilters();
  const { data } = useManageClarityData();
  const normalizedSearchQuery = searchQuery.trim();
  const hasClarityContent = logData.length > 0 || spanData.length > 0;
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
          total={data?.log?.cost ? data?.log?.cost.toLocaleString() : "-"}
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
          total={data?.trace?.cost ? data?.trace?.cost.toLocaleString() : "-"}
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
      {hasClarityContent ? (
        <>
          <Stack gap={3} className="left-column">
            <Table<SummaryData>
              label={"Overall Estimated Cost"}
              columns={summaryColumns}
              rows={overallDataToSummaryRows(data)}
              showToolbar
              timeRangeLabel={timeRangeLabel}
              total={data?.cost ? data.cost.toLocaleString() : "-"}
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
            {logData.length === 0 ? (
              <FilterEmptyStateCard
                title="Here is why you need logs"
                description="Enable logs to see what is happening across your services."
                actionLabel="Turn on logs"
                onAction={() => {
                  console.log("turn on logs");
                }}
              />
            ) : (
              <FilterCard
                onApplyFilter={logFilter.updateLogsFilter}
                title={"Log filters"}
                unit={"GB"}
                received={data?.log?.received}
                sent={data?.log?.sent}
                filtered={data?.log?.filtered}
                pctSampled={logFilter.pctSampled}
                loading={logFilter.loading}
                includeErr={logFilter.includeErr}
              />
            )}
            {spanData.length === 0 ? (
              <FilterEmptyStateCard
                title="Here is why you need traces"
                description="Enable traces to see what's actually happening."
                actionLabel="Turn on traces"
                onAction={() => {
                  console.log("turn on traces");
                }}
              />
            ) : (
              <FilterCard
                onApplyFilter={traceFilter.updateTracesFilter}
                title={"Traces filters"}
                unit={"MM Spans"}
                received={data?.trace?.received}
                sent={data?.trace?.sent}
                filtered={data?.trace?.filtered}
                pctSampled={traceFilter.pctSampled}
                loading={traceFilter.loading}
                includeErr={traceFilter.includeErr}
              />
            )}
          </Stack>
        </>
      ) : (
        <NoConnectionCard />
      )}
    </Box>
  );
}
