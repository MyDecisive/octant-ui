import type { Overall } from "@mydecisiveai/octant-client";
import { useOctantStore } from "@store/octantStore";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { budgetServiceClient } from "../services/budget";

export function useManageClarityData() {
  const { namespace, timeRange } = useOctantStore(
    useShallow((state) => ({
      timeRange: state.timeRange,
      namespace: state.namespace,
    })),
  );

  const [overallData, setOverallData] = useState<Overall | null>(null);
  const [overallLoading, setOverallLoading] = useState(false);

  useEffect(() => {
    async function fetchOverallData() {
      setOverallLoading(true);
      const overallResponse = await budgetServiceClient.overall({
        namespace,
        timeframe: timeRange,
      });
      if (!ignore && overallResponse.data) {
        setOverallData(overallResponse.data);
      }
      setOverallLoading(false);
    }

    let ignore = false;
    if (overallData === null) {
      void fetchOverallData();
    }

    return () => {
      ignore = true;
    };
  }, [overallData, namespace, timeRange]);

  return {
    loading: overallLoading,
    data: overallData,
  };
}
