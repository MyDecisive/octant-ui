import { UpdateFilterResponse_Status } from "@mydecisiveai/octant-client";
import { useClarityStore } from "@store/clarityStore";
import { type Filter, type FilterTypes } from "@types";
import { toFilterType } from "@utils/toFilterTypes";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { filterServiceClient } from "../../services/filter";

const bothFilterTypes: FilterTypes[] = ["logs", "traces"];

export function useManageFilters() {
  const { connectionScope } = useClarityStore(
    useShallow(({ connectionScope }) => ({
      connectionScope,
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

      try {
        const [logFilterResponse, traceFilterResponse] = await Promise.all(
          bothFilterTypes.map((type) =>
            filterServiceClient.getFilter({
              ...connectionScope,
              type: toFilterType(type),
            }),
          ),
        );

        setFilters({
          logs: logFilterResponse.data! as unknown as Filter,
          traces: traceFilterResponse.data! as unknown as Filter,
        });
      } catch {
        setFilters(null);
      } finally {
        setFiltersLoading(new Set());
      }
    }
    if (filters === null) {
      void fetchFilters();
    }
  }, [connectionScope, filters]);

  const handleApplyFilter = async (
    type: FilterTypes,
    pctSampled: number,
    includeErr: boolean,
  ) => {
    setFiltersLoading((state) => new Set(state).add(type));

    try {
      for await (const res of filterServiceClient.updateFilter({
        data: {
          type: toFilterType(type),
          pctSampled,
          includeErr,
        },
        ...connectionScope,
      })) {
        const status = res.status;
        if (status === UpdateFilterResponse_Status.COMPLETED) {
          setFilters((state) => ({
            logs: state?.logs ?? {
              type: "logs",
              pctSampled: 0,
              includeErr: false,
            },
            traces: state?.traces ?? {
              type: "traces",
              pctSampled: 0,
              includeErr: false,
            },
            [type]: {
              type,
              pctSampled,
              includeErr,
            },
          }));
          break;
        }
      }
    } finally {
      setFiltersLoading((state) => {
        const newState = new Set(state);
        newState.delete(type);
        return newState;
      });
    }
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
