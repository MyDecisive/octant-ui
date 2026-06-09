import { Table } from "@components/Table/Table";
import { Tabs } from "@components/Tabs/Tabs";
import type { Overall } from "@mydecisiveai/octant-client";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { ClarityCopy } from "../../copy/clarity/Clarity.copy";
import {
  logsColumns,
  traceColumns,
  type LogData,
  type SpanData,
} from "./constants";
import { TabsEmptyState } from "./TabsEmptyStates";

interface ClarityTabsProps {
  data: Overall | null;
  hasLogData: boolean;
  hasTraceData: boolean;
  logFilterConfigured: boolean;
  logPercentSampled?: number;
  traceFilterConfigured: boolean;
  tracePercentSampled?: number;
  logData: LogData[];
  loading: boolean;
  onRefreshData: () => void;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  spanData: SpanData[];
  tableDataLoading: boolean;
}

export function ClarityTabs({
  data,
  hasLogData,
  hasTraceData,
  logFilterConfigured,
  logPercentSampled,
  traceFilterConfigured,
  tracePercentSampled,
  logData,
  loading,
  onRefreshData,
  searchQuery,
  setSearchQuery,
  spanData,
  tableDataLoading,
}: ClarityTabsProps) {
  const [activeTab, setActiveTab] = useState("logs");
  const showResultCounts = searchQuery.trim().length > 0;

  const searchOptions = [
    ...new Set([
      ...logData.map(({ name }) => name),
      ...spanData.map(({ span }) => span),
    ]),
  ];

  const renderEmptyState = (
    type: "logs" | "traces",
    configured: boolean,
    hasData: boolean,
    percentSampled?: number,
  ) => (
    <TabsEmptyState
      type={type}
      configured={configured}
      hasData={hasData}
      percentSampled={percentSampled}
      searchQuery={searchQuery}
      onClearSearch={() => setSearchQuery("")}
      onRefreshData={onRefreshData}
    />
  );

  return (
    <Tabs
      activeValue={activeTab}
      loading={tableDataLoading}
      onChange={setActiveTab}
      search={{
        options: searchOptions,
        value: searchQuery,
        onChange: setSearchQuery,
      }}
      showLoadingPopover
      showResultCounts={showResultCounts}
      items={[
        {
          value: "logs",
          label: "Logs",
          missingData: !loading && (!logFilterConfigured || !hasLogData),
          resultCount: logData.length,
          children:
            loading || logFilterConfigured ? (
              logData.length === 0 ? (
                renderEmptyState(
                  "logs",
                  logFilterConfigured,
                  hasLogData,
                  logPercentSampled,
                )
              ) : (
                <Table<LogData>
                  label={ClarityCopy.logsTable.title}
                  toolbarTooltip={{
                    ...ClarityCopy.logsTable.tooltip,
                    placement: "right",
                  }}
                  columns={logsColumns}
                  rows={logData}
                  loading={tableDataLoading}
                  showToolbar
                  footerLabel={ClarityCopy.logsTable.tec}
                  total={data?.log?.cost ? data.log.cost.toLocaleString() : "-"}
                />
              )
            ) : (
              renderEmptyState("logs", logFilterConfigured, hasLogData)
            ),
        },
        {
          value: "traces",
          label: "Traces",
          missingData: !loading && (!traceFilterConfigured || !hasTraceData),
          resultCount: spanData.length,
          children:
            loading || traceFilterConfigured ? (
              spanData.length === 0 ? (
                renderEmptyState(
                  "traces",
                  traceFilterConfigured,
                  hasTraceData,
                  tracePercentSampled,
                )
              ) : (
                <Table<SpanData>
                  label={ClarityCopy.traceTable.title}
                  toolbarTooltip={{
                    ...ClarityCopy.traceTable.tooltip,
                    placement: "right",
                  }}
                  columns={traceColumns}
                  rows={spanData}
                  loading={tableDataLoading}
                  showToolbar
                  footerLabel={ClarityCopy.traceTable.tec}
                  total={
                    data?.trace?.cost ? data.trace.cost.toLocaleString() : "-"
                  }
                />
              )
            ) : (
              renderEmptyState("traces", traceFilterConfigured, hasTraceData)
            ),
        },
      ]}
    />
  );
}
