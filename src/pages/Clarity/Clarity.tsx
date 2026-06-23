import { Select } from "@components/formInputs/Select";
import { PageContainer } from "@components/layout/PageContainer";
import { Table } from "@components/Table/Table";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useClarityStore } from "@store/clarity/store";
import { timeframeLabels } from "@utils/timeframeToPickerOptions";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { ClarityCopy as cc } from "../../copy/clarity/Clarity.copy";
import "./Clarity.css";
import { ClarityTabs } from "./ClarityTabs";
import { summaryColumns, type SummaryData } from "./constants";
import { LogsFilterControl } from "./LogsFilterControl";
import { TracesFilterControl } from "./TracesFilterControl";
import { useManageClarityData } from "./useManageClarityData";
import { useManageTimeframes } from "./useManageTimeframes";

export function ClarityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { logsConfigured, tracesConfigured, logFilter, traceFilter } =
    useClarityStore(
      useShallow(({ filters, configured }) => ({
        logFilter: filters.logs,
        traceFilter: filters.traces,
        logsConfigured: !!configured.logs,
        tracesConfigured: !!configured.traces,
      })),
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
  } = useManageClarityData(searchQuery);

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
            logPercentSampled={logFilter?.pctSampled}
            logDataTypeConfigured={logsConfigured}
            tracePercentSampled={traceFilter?.pctSampled}
            traceDataTypeConfigured={tracesConfigured}
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
          <LogsFilterControl {...data?.log} />
          <TracesFilterControl {...data?.trace} />
        </Stack>
      </Box>
    </PageContainer>
  );
}
