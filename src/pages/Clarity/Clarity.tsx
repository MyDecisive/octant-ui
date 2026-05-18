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
import { ClarityCopy as cc } from "../../copy/clarity/Clarity.copy";

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
            label={cc.timerange.label}
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
                label={cc.overall.title}
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
                  title={cc.logFilter.emptyState.title}
                  description={cc.logFilter.emptyState.subtitle}
                  actionLabel={cc.logFilter.emptyState.cta}
                  onAction={() => {
                    console.log("turn on logs");
                  }}
                />
              ) : (
                <FilterCard
                  onApplyFilter={logFilter.updateLogsFilter}
                  title={cc.logFilter.title}
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
                  title={cc.traceFilter.emptyState.title}
                  description={cc.traceFilter.emptyState.subtitle}
                  actionLabel={cc.traceFilter.emptyState.cta}
                  onAction={() => {
                    console.log("turn on traces");
                  }}
                />
              ) : (
                <FilterCard
                  onApplyFilter={traceFilter.updateTracesFilter}
                  title={cc.traceFilter.title}
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
            title={cc.overallErrorState.header}
            description={cc.overallErrorState.body}
            actionLabel={cc.overallErrorState.cta}
          />
        )}
      </Box>
    </PageContainer>
  );
}
