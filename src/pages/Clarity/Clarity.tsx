import { FilterCard } from "@components/FilterCard/FilterCard";
import { FilterEmptyStateCard } from "@components/FilterCard/FilterEmptyStateCard";
import { Select } from "@components/formInputs/Select";
import { PageContainer } from "@components/layout/PageContainer";
import { NoConnectionCard } from "@components/NoConnectionCard";
import { Table } from "@components/Table/Table";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { timeframeLabels } from "@utils/timeframeToPickerOptions";
import { useState } from "react";
import { ClarityCopy as cc } from "../../copy/clarity/Clarity.copy";
import "./Clarity.css";
import { ClarityTabs } from "./ClarityTabs";
import { summaryColumns, type SummaryData } from "./constants";
import { useManageClarityData } from "./useManageClarityData";
import { useManageFilters } from "./useManageFilters";
import { useManageTimeframes } from "./useManageTimeframes";

export function ClarityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { logFilter, traceFilter } = useManageFilters();
  const { setSelectedTimeframe, selectedTimeframe, timeframeOptions } =
    useManageTimeframes();
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
  const hasTableData = hasLogData || hasTraceData;
  const hasClarityContent = loading || hasTableData;

  const timeRangeLabel = timeframeLabels[selectedTimeframe];

  const pickerFriendlySelectedTimeframe = String(selectedTimeframe);

  return (
    <PageContainer
      headerActions={
        hasTableData ? (
          <Select
            selected={pickerFriendlySelectedTimeframe}
            onChange={(event) => setSelectedTimeframe(event.target.value)}
            options={timeframeOptions}
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
                toolbarTooltip={cc.overall.tooltip}
                total={data?.cost ? data.cost.toLocaleString() : "-"}
                summaryTable
              />
              <ClarityTabs
                data={data}
                hasLogData={hasLogData}
                hasTraceData={hasTraceData}
                logPercentSampled={logFilter.pctSampled}
                tracePercentSampled={traceFilter.pctSampled}
                logData={logData}
                loading={loading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                spanData={spanData}
                tableDataLoading={tableDataLoading}
              />
            </Stack>
            <Stack className="right-column" gap={1}>
              {!hasLogData ? (
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
              {!hasTraceData ? (
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
