import type { Log, Overall, Span } from "@mydecisiveai/octant-client";
import { useClarityStore } from "@store/clarityStore";
import { useEffect, useState } from "react";
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
  const hasLogTimeframeData = useClarityStore((state) => state.logData);
  const hasTraceTimeframeData = useClarityStore((state) => state.traceData);

  const [overallData, setOverallData] = useState<Overall | null>(null);
  const [logData, setLogData] = useState<LogData[]>([]);
  const [spanData, setSpanData] = useState<SpanData[]>([]);
  const [overallLoading, setOverallLoading] = useState(false);
  const [tableDataLoading, setTableDataLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchOverallData() {
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
        const overallResponse = await budgetServiceClient.overall({
          namespace,
          timeframe: timeRange,
        });

        if (!ignore) {
          setOverallData(overallResponse.data ?? null);
        }
      } catch {
        if (!ignore) {
          setOverallData(null);
        }
      } finally {
        if (!ignore) {
          setOverallLoading(false);
        }
      }
    }

    void fetchOverallData();

    return () => {
      ignore = true;
    };
  }, [namespace, timeRange]);

  useEffect(() => {
    let ignore = false;

    async function fetchTableData() {
      if (!connectionName || !namespace || !overallData) {
        setLogData([]);
        setSpanData([]);
        return;
      }

      if (!hasLogTimeframeData && !hasTraceTimeframeData) {
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
        hasLogTimeframeData
          ? budgetServiceClient.log(request)
          : Promise.resolve(null),
        hasTraceTimeframeData
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
  ]);

  return {
    loading: overallLoading || tableDataLoading,
    overallLoading,
    tableDataLoading,
    data: overallData,
    summaryData: overallToSummaryRows(overallData),
    logData,
    spanData,
    hasLogData: (overallData?.log?.sent ?? 0) > 0 && !!hasLogTimeframeData,
    hasTraceData:
      (overallData?.trace?.sent ?? 0) > 0 && !!hasTraceTimeframeData,
  };
}
