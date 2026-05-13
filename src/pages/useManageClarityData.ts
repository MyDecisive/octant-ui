import type { Log, Overall, Span } from "@mydecisiveai/octant-client";
import { useOctantStore } from "@store/octantStore";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { budgetServiceClient } from "../services/budget";
import type { LogData, SpanData } from "./constants";

const tablePageSize = 100;

function truncateDecimal(value: number, decimalPlaces = 2) {
  const factor = 10 ** decimalPlaces;
  return Math.trunc(value * factor) / factor;
}

function normalizeOverallMetric(metric: Overall["log"]) {
  if (!metric) return undefined;

  return {
    ...metric,
    received: truncateDecimal(metric.received),
    sent: truncateDecimal(metric.sent),
    filtered: truncateDecimal(metric.filtered),
    costRate: truncateDecimal(metric.costRate),
    pct: truncateDecimal(metric.pct),
    cost: truncateDecimal(metric.cost),
  };
}

function normalizeOverall(data?: Overall): Overall | null {
  if (!data) return null;

  return {
    ...data,
    cost: truncateDecimal(data.cost),
    log: normalizeOverallMetric(data.log),
    trace: normalizeOverallMetric(data.trace),
  };
}

function logToRow({ name, sent, pct, cost }: Log, index: number): LogData {
  return {
    id: name || `log-${index.toString()}`,
    name,
    sent: truncateDecimal(sent),
    percent: truncateDecimal(pct),
    cost: truncateDecimal(cost),
  };
}

function spanToRow(
  { name, breadth, invocations, depth, cost }: Span,
  index: number,
): SpanData {
  return {
    id: name || `span-${index.toString()}`,
    span: name,
    breadth: truncateDecimal(breadth),
    invocations: truncateDecimal(invocations),
    depth: truncateDecimal(depth),
    cost: truncateDecimal(cost),
  };
}

export function useManageClarityData(searchQuery = "") {
  const { connectionName, namespace, timeRange } = useOctantStore(
    useShallow((state) => ({
      connectionName: state.connectionName,
      timeRange: state.timeRange,
      namespace: state.namespace,
    })),
  );

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
          setOverallData(normalizeOverall(overallResponse.data));
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

      const shouldFetchLogs = (overallData.log?.sent ?? 0) > 0;
      const shouldFetchTraces = (overallData.trace?.sent ?? 0) > 0;

      if (!shouldFetchLogs && !shouldFetchTraces) {
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
        shouldFetchLogs
          ? budgetServiceClient.log(request)
          : Promise.resolve(null),
        shouldFetchTraces
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
  }, [connectionName, namespace, overallData, searchQuery, timeRange]);

  return {
    loading: overallLoading || tableDataLoading,
    overallLoading,
    tableDataLoading,
    data: overallData,
    logData,
    spanData,
    hasLogData: (overallData?.log?.sent ?? 0) > 0,
    hasTraceData: (overallData?.trace?.sent ?? 0) > 0,
  };
}
