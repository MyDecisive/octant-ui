import type { Log, Overall, Span } from "@mydecisiveai/octant-client";
import { useOctantStore } from "@store/octantStore";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { budgetServiceClient } from "../services/budget";
import type { LogData, SpanData } from "./constants";

const tablePageSize = 100;

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
        return;
      }

      setOverallLoading(true);

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
      if (!connectionName || !namespace) {
        setLogData([]);
        setSpanData([]);
        return;
      }

      setTableDataLoading(true);

      try {
        const request = {
          connectionName,
          namespace,
          timeframe: timeRange,
          size: tablePageSize,
          pageToken: "",
          search: searchQuery.trim(),
        };
        const [logResponse, traceResponse] = await Promise.all([
          budgetServiceClient.log(request),
          budgetServiceClient.trace(request),
        ]);

        if (!ignore) {
          setLogData(logResponse.data.map(logToRow));
          setSpanData(traceResponse.data.map(spanToRow));
        }
      } catch {
        if (!ignore) {
          setLogData([]);
          setSpanData([]);
        }
      } finally {
        if (!ignore) {
          setTableDataLoading(false);
        }
      }
    }

    void fetchTableData();

    return () => {
      ignore = true;
    };
  }, [connectionName, namespace, searchQuery, timeRange]);

  return {
    loading: overallLoading || tableDataLoading,
    overallLoading,
    tableDataLoading,
    data: overallData,
    logData,
    spanData,
  };
}
