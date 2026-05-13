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
  logsColumns,
  summaryColumns,
  traceColumns,
  type LogData,
  type SpanData,
  type SummaryData,
} from "./constants";
import { useManageClarityData } from "./useManageClarityData";
import { useManageFilters } from "./useManageFilters";

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
  const { hasLogTimeframeData, hasTraceTimeframeData, timeRangeLabel } =
    useOctantStore(
      useShallow((state) => ({
        hasLogTimeframeData: state.hasLogTimeframeData,
        hasTraceTimeframeData: state.hasTraceTimeframeData,
        timeRangeLabel: timeframeLabels[state.timeRange],
      })),
  );
  const { logFilter, traceFilter } = useManageFilters();
  const {
    data,
    hasLogData,
    hasTraceData,
    logData,
    spanData,
    tableDataLoading,
    loading,
  } = useManageClarityData(searchQuery);
  const normalizedSearchQuery = searchQuery.trim();
  const canShowLogTab = hasLogTimeframeData !== false && hasLogData;
  const canShowTraceTab = hasTraceTimeframeData !== false && hasTraceData;
  const canRenderLogTab =
    hasLogTimeframeData !== false && (hasLogData || loading);
  const canRenderTraceTab =
    hasTraceTimeframeData !== false && (hasTraceData || loading);
  const hasClarityContent = loading || canShowLogTab || canShowTraceTab;
  const showResultCounts = normalizedSearchQuery.length > 0;
  const searchOptions = [
    ...new Set([
      ...logData.map(({ name }) => name),
      ...spanData.map(({ span }) => span),
    ]),
  ];

  useEffect(() => {
    if (activeTab === "logs" && !canShowLogTab && canShowTraceTab) {
      setActiveTab("traces");
    }
    if (activeTab === "traces" && !canShowTraceTab && canShowLogTab) {
      setActiveTab("logs");
    }
  }, [activeTab, canShowLogTab, canShowTraceTab]);

  const tabs: TabItem[] = [];

  if (canRenderLogTab) {
    tabs.push({
      value: "logs",
      label: "Logs",
      resultCount: logData.length,
      children: (
        <Table<LogData>
          label={"Logs - Top Talkers"}
          columns={logsColumns}
          rows={logData}
          loading={tableDataLoading}
          showToolbar
          footerLabel={"Total estimated cost"}
          total={data?.log?.cost ? data?.log?.cost.toLocaleString() : "-"}
        />
      ),
    });
  }

  if (canRenderTraceTab) {
    tabs.push({
      value: "traces",
      label: "Traces",
      resultCount: spanData.length,
      children: (
        <Table<SpanData>
          label={"Traces - Top Talkers"}
          columns={traceColumns}
          rows={spanData}
          loading={tableDataLoading}
          showToolbar
          footerLabel={"Total estimated cost"}
          total={data?.trace?.cost ? data?.trace?.cost.toLocaleString() : "-"}
        />
      ),
    });
  }

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
              loading={tableDataLoading}
              onChange={setActiveTab}
              search={{
                options: searchOptions,
                value: searchQuery,
                onChange: setSearchQuery,
              }}
              showLoadingPopover
              showResultCounts={showResultCounts}
            />
          </Stack>
          <Stack className="right-column" gap={1}>
            {!canShowLogTab ? (
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
            {!canShowTraceTab ? (
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
