import { NoConnectionCard } from "@components/NoConnectionCard";
import { Table } from "@components/Table/Table";
import { Tabs } from "@components/Tabs/Tabs";
import type { Overall } from "@mydecisiveai/octant-client";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import {
  logsColumns,
  traceColumns,
  type LogData,
  type SpanData,
} from "./constants";

interface ClarityTabsProps {
  data: Overall | null;
  hasLogData: boolean;
  hasTraceData: boolean;
  logData: LogData[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  spanData: SpanData[];
  tableDataLoading: boolean;
}

export function ClarityTabs({
  data,
  hasLogData,
  hasTraceData,
  logData,
  loading,
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
  const tableEmptyState = (
    <NoConnectionCard
      title="Looks like there's a connection issue"
      description="Let's review and manage your pipeline to make sure everything is connected."
      actionLabel="Review in System Health"
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
          resultCount: logData.length,
          children:
            loading || hasLogData ? (
              <Table<LogData>
                label={"Logs - Top Talkers"}
                columns={logsColumns}
                rows={logData}
                loading={tableDataLoading}
                showToolbar
                footerLabel={"Total estimated cost"}
                total={data?.log?.cost ? data.log.cost.toLocaleString() : "-"}
              />
            ) : (
              tableEmptyState
            ),
        },
        {
          value: "traces",
          label: "Traces",
          resultCount: spanData.length,
          children:
            loading || hasTraceData ? (
              <Table<SpanData>
                label={"Traces - Top Talkers"}
                columns={traceColumns}
                rows={spanData}
                loading={tableDataLoading}
                showToolbar
                footerLabel={"Total estimated cost"}
                total={
                  data?.trace?.cost ? data.trace.cost.toLocaleString() : "-"
                }
              />
            ) : (
              tableEmptyState
            ),
        },
      ]}
    />
  );
}
