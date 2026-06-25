import { Tabs } from "@components/Tabs/Tabs";
import { FILTER_TYPES } from "@constants/enums";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";
import type { Overall } from "@mydecisiveai/octant-client";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { ClarityTabTable } from "./ClarityTabTables";
import type { LogData, SpanData } from "./constants";
import { formatTabLabel } from "./formatTabLabel";

interface ClarityTabsProps {
  data: Overall | null;
  hasLogData: boolean;
  hasTraceData: boolean;
  logDataTypeConfigured: boolean;
  logPercentSampled?: number;
  traceDataTypeConfigured: boolean;
  tracePercentSampled?: number;
  logData: LogData[];
  loading: boolean;
  onRefreshData: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  spanData: SpanData[];
  tableDataLoading: boolean;
}

export function ClarityTabs({
  data,
  hasLogData,
  hasTraceData,
  logDataTypeConfigured,
  logPercentSampled,
  traceDataTypeConfigured,
  tracePercentSampled,
  logData,
  loading,
  onRefreshData,
  searchQuery,
  setSearchQuery,
  spanData,
  tableDataLoading,
}: ClarityTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(FILTER_TYPES.LOG);
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
      onChange={setActiveTab}
      search={{
        options: searchOptions,
        value: searchQuery,
        onChange: setSearchQuery,
      }}
      items={[
        {
          value: FILTER_TYPES.LOG,
          label: {
            text: formatTabLabel(
              "Logs",
              showResultCounts ? logData.length : undefined,
            ),
            loading: tableDataLoading,
            tooltip: tableDataLoading ? "Data is still loading" : undefined,
            startIcon:
              !loading && (!logDataTypeConfigured || !hasLogData) ? (
                <WarningAmberRounded fontSize="small" />
              ) : undefined,
          },
          children: (
            <ClarityTabTable
              dataType={FILTER_TYPES.LOG}
              configured={logDataTypeConfigured}
              data={data}
              hasData={hasLogData}
              loading={tableDataLoading}
              onClearSearch={() => setSearchQuery("")}
              onRefreshData={onRefreshData}
              percentSampled={logPercentSampled}
              rows={logData}
              searchQuery={searchQuery}
            />
          ),
        },
        {
          value: FILTER_TYPES.TRACE,
          label: {
            text: formatTabLabel(
              "Traces",
              showResultCounts ? spanData.length : undefined,
            ),
            loading: tableDataLoading,
            tooltip: tableDataLoading ? "Data is still loading" : undefined,
            startIcon:
              !loading && (!traceDataTypeConfigured || !hasTraceData) ? (
                <WarningAmberRounded fontSize="small" />
              ) : undefined,
          },
          children: (
            <ClarityTabTable
              dataType={FILTER_TYPES.TRACE}
              configured={traceDataTypeConfigured}
              data={data}
              hasData={hasTraceData}
              loading={tableDataLoading}
              onClearSearch={() => setSearchQuery("")}
              onRefreshData={onRefreshData}
              percentSampled={tracePercentSampled}
              rows={spanData}
              searchQuery={searchQuery}
            />
          ),
        },
      ]}
    />
  );
}
