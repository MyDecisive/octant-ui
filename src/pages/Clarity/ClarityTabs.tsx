import { Tabs } from "@components/Tabs/Tabs";
import type { Overall } from "@mydecisiveai/octant-client";
import { FilterTypes } from "@types";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { ClarityTabTable } from "./ClarityTabTables";
import type { LogData, SpanData } from "./constants";

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
  const [activeTab, setActiveTab] = useState<string>(FilterTypes.LOG);
  const showResultCounts = searchQuery.trim().length > 0;

  const searchOptions = [
    ...new Set([
      ...logData.map(({ name }) => name),
      ...spanData.map(({ span }) => span),
    ]),
  ];

  const renderEmptyState = (type: "logs" | "traces", percentSampled?: number) => {
    const copy = type === "logs" ? ClarityCopy.logsEmptyStates : ClarityCopy.traceEmptyStates;

    if (searchQuery) {
      const { title, description, actionLabel } = copy.noResults(searchQuery);
      return (
        <NoConnectionCard
          title={title}
          description={description}
          actionLabel={actionLabel}
          onButtonClick={() => setSearchQuery("")}
        />
      );
    }

    if (percentSampled === 0) {
      return (
        <NoConnectionCard
          title={copy.zeroSampling.title}
          description={copy.zeroSampling.description}
        />
      );
    }

    const { title, description, actionLabel } = copy.filteringIssue;
    return (
      <NoConnectionCard
        title={title}
        description={description}
        actionLabel={actionLabel}
        onButtonClick={() => setLocation(ROUTES.SYSTEMHEALTH)}
      />
    );
  };

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
          value: FilterTypes.LOG,
          label: "Logs",
          missingData: !loading && (!logDataTypeConfigured || !hasLogData),
          resultCount: logData.length,
          children: (
            <ClarityTabTable
              dataType={FilterTypes.LOG}
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
          value: FilterTypes.TRACE,
          label: "Traces",
          missingData: !loading && (!traceDataTypeConfigured || !hasTraceData),
          resultCount: spanData.length,
          children: (
            <ClarityTabTable
              dataType={FilterTypes.TRACE}
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