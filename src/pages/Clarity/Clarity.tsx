import { FilterCard } from "@components/FilterCard/FilterCard";
import { FilterEmptyStateCard } from "@components/FilterCard/FilterEmptyStateCard";
import { Select } from "@components/formInputs/Select";
import { PageContainer } from "@components/layout/PageContainer";
import { NoConnectionCard } from "@components/NoConnectionCard";
import { Table } from "@components/Table/Table";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import "./Clarity.css";
import { ClarityTabs } from "./ClarityTabs";
import { summaryColumns, type SummaryData } from "./constants";
import { useManageClarityData } from "./useManageClarityData";
import { useManageFilters } from "./useManageFilters";
import { useManageTimeframes } from "./useManageTimeframes";

export function ClarityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { logFilter, traceFilter } = useManageFilters();
  const {
    hasLogTimeframeData,
    hasTraceTimeframeData,
    pickerOptions,
    selectedTimeRange,
    setSelectedTimeRange,
    timeRangeLabel,
  } = useManageTimeframes();
  const {
    data,
    hasLogData,
    hasTraceData,
    logData,
    spanData,
    summaryData,
    tableDataLoading,
    loading,
  } = useManageClarityData(searchQuery);
  const hasAvailableLogData = hasLogTimeframeData && hasLogData;
  const hasAvailableTraceData = hasTraceTimeframeData && hasTraceData;
  const hasTableData = hasAvailableLogData || hasAvailableTraceData;
  const hasClarityContent = loading || hasTableData;

  return (
    <PageContainer
      headerActions={
        hasTableData ? (
          <Select
            selected={selectedTimeRange}
            onChange={(event) => setSelectedTimeRange(event.target.value)}
            options={pickerOptions}
            className="clarity-timepicker"
            label="Time range"
            size="small"
          />
        ) : undefined
      }
    >
      <Box className="main-content-container">
        {hasClarityContent ? (
          <>
            <Stack gap={3} className="left-column">
              <Table<SummaryData>
                label={"Overall Estimated Cost"}
                columns={summaryColumns}
                rows={summaryData}
                showToolbar
                timeRangeLabel={timeRangeLabel}
                total={data?.cost ? data.cost.toLocaleString() : "-"}
                summaryTable
              />
              <ClarityTabs
                data={data}
                hasLogData={hasAvailableLogData}
                hasTraceData={hasAvailableTraceData}
                logData={logData}
                loading={loading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                spanData={spanData}
                tableDataLoading={tableDataLoading}
              />
            </Stack>
            <Stack className="right-column" gap={1}>
              {!hasAvailableLogData ? (
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
              {!hasAvailableTraceData ? (
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
          <NoConnectionCard
            title="Looks like there's a connection issue"
            description="We may not have visibility into your data. Let's review and manage your pipeline to make sure everything is connected."
            actionLabel="Go to Connections"
          />
        )}
      </Box>
    </PageContainer>
  );
}
