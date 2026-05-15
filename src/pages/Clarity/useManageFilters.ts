import { UpdateFilterResponse_Status } from "@mydecisiveai/octant-client";
import { useOctantStore } from "@store/octantStore";
import { type Filter, type FilterTypes } from "@types";
import { toFilterType } from "@utils/toFilterTypes";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { filterServiceClient } from "../../services/filter";

const bothFilterTypes: FilterTypes[] = ["logs", "traces"];

export function useManageFilters() {
  const { connectionName, namespace } = useOctantStore(
    useShallow((state) => ({
      connectionName: state.connectionName,
      namespace: state.namespace,
    })),
  );
  const [filters, setFilters] = useState<Record<FilterTypes, Filter> | null>(
    null,
  );
  const [filtersLoading, setFiltersLoading] = useState<Set<FilterTypes>>(
    new Set(),
  );

  useEffect(() => {
    async function fetchFilters() {
      setFiltersLoading(new Set<FilterTypes>(bothFilterTypes));

      const [logFilterResponse, traceFilterResponse] = await Promise.all(
        bothFilterTypes.map((type) =>
          filterServiceClient.getFilter({
            connectionName,
            namespace,
            type: toFilterType(type),
          }),
        ),
      );

      setFilters({
        logs: logFilterResponse.data! as unknown as Filter,
        traces: traceFilterResponse.data! as unknown as Filter,
      });
      setFiltersLoading(new Set());
    }
    if (filters === null) {
      void fetchFilters();
    }
  }, [connectionName, namespace, filters]);

  const handleApplyFilter = async (
    type: FilterTypes,
    pctSampled: number,
    includeErr: boolean,
  ) => {
    setFiltersLoading((state) => state.add(type));

    for await (const res of filterServiceClient.updateFilter({
      data: {
        type: toFilterType(type),
        pctSampled,
        includeErr,
      },
      namespace,
      connectionName,
    })) {
      const status = res.status;
      if (status === UpdateFilterResponse_Status.COMPLETED) {
        break;
      }
    }

    setFiltersLoading((state) => {
      const newState = new Set(state);
      newState.delete(type);
      return newState;
    });
  };

  return {
    logFilter: {
      ...filters?.logs,
      loading: filtersLoading.has("logs"),
      updateLogsFilter: (pctSampled: number, includeErr: boolean) =>
        handleApplyFilter("logs", pctSampled, includeErr),
    },
    traceFilter: {
      ...filters?.traces,
      loading: filtersLoading.has("traces"),
      updateTracesFilter: (pctSampled: number, includeErr: boolean) =>
        handleApplyFilter("traces", pctSampled, includeErr),
    },
  };
}
