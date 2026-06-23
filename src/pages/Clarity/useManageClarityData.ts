import type { Log, Overall, Span } from "@mydecisiveai/octant-client";
import { useClarityStore } from "@store/clarity/store";
import { FilterTypes } from "@types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { budgetServiceClient } from "../../services/budget";
import type { LogData, SpanData, SummaryData } from "./constants";

const tablePageSize = 100;

function overallToSummaryRows(data: Overall | null): SummaryData[] {
  return [
    {
      id: "logs",
      type: "logs",
      cost: data?.log?.cost,
      sent: data?.log?.sent,
      rate: data?.log?.costRate,
      pct: data?.log?.pct,
    },
    {
      id: "traces",
      type: "traces",
      cost: data?.trace?.cost,
      sent: data?.trace?.sent,
      rate: data?.trace?.costRate,
      pct: data?.trace?.pct,
    },
  ];
}

function logToRow({ name, sent, pct, cost }: Log, index: number): LogData {
  return {
    id: name || `log-${index.toString()}`,
    name,
    sent,
    percent: pct,
    cost,
  };
}

function spanToRow(
  { name, breadth, invocations, depth, cost }: Span,
  index: number,
): SpanData {
  return {
    id: name || `span-${index.toString()}`,
    span: name,
    breadth,
    invocations,
    depth,
    cost,
  };
}

export function useManageClarityData(searchQuery = "") {
  const { connectionScope } = useClarityStore(
    useShallow(({ connectionScope }) => ({
      connectionScope,
    })),
  );

  const { namespace, connectionName } = connectionScope || {};

  const timeRange = useClarityStore((state) => state.selectedTimeframe);
  const hasLogTimeframeData = useClarityStore(
    (state) => state.hasData[FilterTypes.LOG],
  );
  const hasTraceTimeframeData = useClarityStore(
    (state) => state.hasData[FilterTypes.TRACE],
  );

  const canRequestLogData = useClarityStore(
    useShallow(
      (state) =>
        !!(state.configured[FilterTypes.LOG] && state.hasData[FilterTypes.LOG]),
    ),
  );
  const canRequestTraceData = useClarityStore(
    useShallow(
      (state) =>
        !!(
          state.configured[FilterTypes.TRACE] &&
          state.hasData[FilterTypes.TRACE]
        ),
    ),
  );

  const [overallData, setOverallData] = useState<Overall | null>(null);
  const [logData, setLogData] = useState<LogData[]>([]);
  const [spanData, setSpanData] = useState<SpanData[]>([]);
  const [overallLoading, setOverallLoading] = useState(false);
  const [tableDataLoading, setTableDataLoading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const fetchOverallData = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (!namespace) {
      setOverallData(null);
      setLogData([]);
      setSpanData([]);
      return;
    }

    setOverallLoading(true);
    setOverallData(null);
    setLogData([]);
    setSpanData([]);

    try {
      const overallResponse = await budgetServiceClient.overall(
        {
          namespace,
          timeframe: timeRange,
        },
        {
          signal: controller.signal,
        },
      );

      if (!controller.signal.aborted) {
        setOverallData(overallResponse.data ?? null);
      }
    } catch {
      if (!controller.signal.aborted) {
        setOverallData(null);
      }
    } finally {
      if (!controller.signal.aborted) {
        setOverallLoading(false);
      }
    }
  }, [namespace, timeRange]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchOverallData();
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchOverallData]);

  useEffect(() => {
    let ignore = false;

    async function fetchTableData() {
      if (!connectionName || !namespace || !overallData) {
        setLogData([]);
        setSpanData([]);
        return;
      }

      setTableDataLoading(true);

      const request = {
        connectionName,
        namespace,
        timeframe: timeRange,
        size: tablePageSize,
        pageToken: "",
        search: searchQuery.trim(),
      };

      const [logResponse, traceResponse] = await Promise.allSettled([
        canRequestLogData
          ? budgetServiceClient.log(request)
          : Promise.resolve(null),
        canRequestTraceData
          ? budgetServiceClient.trace(request)
          : Promise.resolve(null),
      ]);

      if (!ignore) {
        if (logResponse.status === "fulfilled") {
          setLogData(logResponse.value?.data.map(logToRow) ?? []);
        } else {
          setLogData([]);
        }

        if (traceResponse.status === "fulfilled") {
          setSpanData(traceResponse.value?.data.map(spanToRow) ?? []);
        } else {
          setSpanData([]);
        }

        setTableDataLoading(false);
      }
    }

    void fetchTableData();

    return () => {
      ignore = true;
    };
  }, [
    connectionName,
    namespace,
    overallData,
    searchQuery,
    timeRange,
    hasTraceTimeframeData,
    hasLogTimeframeData,
    canRequestLogData,
    canRequestTraceData,
  ]);

  return {
    loading: overallLoading || tableDataLoading,
    overallLoading,
    tableDataLoading,
    data: overallData,
    summaryData: overallToSummaryRows(overallData),
    logData,
    spanData,
    hasLogData:
      canRequestLogData &&
      ((overallData?.log?.sent ?? 0) > 0 || logData.length > 0),
    hasTraceData:
      canRequestTraceData &&
      ((overallData?.trace?.sent ?? 0) > 0 || spanData.length > 0),
    refreshData: fetchOverallData,
  };
}
