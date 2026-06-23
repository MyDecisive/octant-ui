import { Select } from "@components/formInputs/Select";
import { PageContainer } from "@components/layout/PageContainer";
import { Table } from "@components/Table/Table";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useOctantStore } from "@store/octantStore";
import { FilterTypes } from "@types";
import { fromMLTTypes } from "@utils/fromMltTypes";
import { timeframeLabels } from "@utils/timeframeToPickerOptions";
import { useState } from "react";
import { useLocation } from "wouter";
import { useShallow } from "zustand/shallow";
import { ROUTES } from "../../constants/routing";
import { ClarityCopy as cc } from "../../copy/clarity/Clarity.copy";
import "./Clarity.css";
import { ClarityTabs } from "./ClarityTabs";
import { summaryColumns, type SummaryData } from "./constants";
import { FilterCard } from "./FilterCard/FilterCard";
import { FilterEmptyStateCard } from "./FilterCard/FilterEmptyStateCard";
import { useManageClarityData } from "./useManageClarityData";
import { useManageFilters } from "./useManageFilters";
import { useManageTimeframes } from "./useManageTimeframes";

export function ClarityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();
  const { logFilter, traceFilter } = useManageFilters();
  const connectionTelemetryTypes = useOctantStore(
    useShallow(({ connection }) => connection?.telemetryTypes ?? []),
  );
  const selectedTelemetryTypes = fromMLTTypes(connectionTelemetryTypes);
  const logDataTypeConfigured = selectedTelemetryTypes.includes(
    FilterTypes.LOG,
  );
  const traceDataTypeConfigured = selectedTelemetryTypes.includes(
    FilterTypes.TRACE,
  );
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
    refreshData,
  } = useManageClarityData(
    searchQuery,
    logDataTypeConfigured,
    traceDataTypeConfigured,
  );

  const timeRangeLabel = timeframeLabels[selectedTimeframe];

  const pickerFriendlySelectedTimeframe = String(selectedTimeframe);

  return (
    <PageContainer
      headerActions={
        <Select
          selected={pickerFriendlySelectedTimeframe}
          onChange={(event) => setSelectedTimeframe(event.target.value)}
          options={timeframeOptions}
          className="clarity-timepicker"
          label={cc.timerange.label}
          size="small"
        />
      }
    >
      <Box className="main-content-container">
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
              logDataTypeConfigured={logDataTypeConfigured}
              tracePercentSampled={traceFilter.pctSampled}
              traceDataTypeConfigured={traceDataTypeConfigured}
              logData={logData}
              loading={loading}
              onRefreshData={refreshData}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              spanData={spanData}
              tableDataLoading={tableDataLoading}
            />
          </Stack>
          <Stack className="right-column" gap={1}>
            {!logDataTypeConfigured ? (
              <FilterEmptyStateCard
                title={cc.logFilter.emptyState.title}
                description={cc.logFilter.emptyState.subtitle}
                actionLabel={cc.logFilter.emptyState.cta}
                onAction={() => navigate(ROUTES.SETTINGS)}
              />
            ) : (
              <FilterCard
                key={`${FilterTypes.LOG}-${logFilter.pctSampled}-${logFilter.includeErr}`}
                defaultExpanded={logDataTypeConfigured}
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
            {!traceDataTypeConfigured ? (
              <FilterEmptyStateCard
                title={cc.traceFilter.emptyState.title}
                description={cc.traceFilter.emptyState.subtitle}
                actionLabel={cc.traceFilter.emptyState.cta}
                onAction={() => navigate(ROUTES.SETTINGS)}
              />
            ) : (
              <FilterCard
                key={`${FilterTypes.TRACE}-${traceFilter.pctSampled}-${traceFilter.includeErr}`}
                defaultExpanded={!logDataTypeConfigured}
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
      </Box>
    </PageContainer>
  );
}
