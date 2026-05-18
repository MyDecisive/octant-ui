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
import { ClarityCopy } from "../../copy/clarity/Clarity.copy";

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
                label={ClarityCopy.logsTable.title}
                columns={logsColumns}
                rows={logData}
                loading={tableDataLoading}
                showToolbar
                footerLabel={ClarityCopy.logsTable.tec}
                total={data?.log?.cost ? data.log.cost.toLocaleString() : "-"}
              />
            ) : (
              <NoConnectionCard
                title={ClarityCopy.logsTable.connectionIssue.header
                }
                description={ClarityCopy.logsTable.connectionIssue.body
                }
                actionLabel={ClarityCopy.logsTable.connectionIssue.cta
                }
              />
            ),
        },
        {
          value: "traces",
          label: "Traces",
          resultCount: spanData.length,
          children:
            loading || hasTraceData ? (
              <Table<SpanData>
                label={ClarityCopy.traceTable.title}
                columns={traceColumns}
                rows={spanData}
                loading={tableDataLoading}
                showToolbar
                footerLabel={ClarityCopy.traceTable.tec}
                total={
                  data?.trace?.cost ? data.trace.cost.toLocaleString() : "-"
                }
              />
            ) : (
              <NoConnectionCard
                title={ClarityCopy.traceTable.connectionIssue.header
                }
                description={ClarityCopy.traceTable.connectionIssue.body
                }
                actionLabel={ClarityCopy.traceTable.connectionIssue.cta
                }
              />
            ),
        },
      ]}
    />
  );
}
