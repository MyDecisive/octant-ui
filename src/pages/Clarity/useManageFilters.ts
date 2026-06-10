import {
  UpdateFilterResponse_Status,
  type GetFilterResponse,
} from "@mydecisiveai/octant-client";
import { useClarityStore } from "@store/clarityStore";
import { FilterTypes, type Filter } from "@types";
import { toFilterType } from "@utils/toFilterTypes";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { filterServiceClient } from "../../services/filter";

const bothFilterTypes: FilterTypes[] = [FilterTypes.LOG, FilterTypes.TRACE];

interface ManagedFilter extends Partial<Filter> {
  configured: boolean;
}

const defaultFilters: Record<FilterTypes, ManagedFilter> = {
  [FilterTypes.LOG]: {
    type: FilterTypes.LOG,
    configured: false,
  },
  [FilterTypes.TRACE]: {
    type: FilterTypes.TRACE,
    configured: false,
  },
};

function normalizeFilterResponse(
  expectedType: FilterTypes,
  response: GetFilterResponse,
): ManagedFilter {
  if (!response.data) {
    return defaultFilters[expectedType];
  }

  return {
    type: expectedType,
    configured: true,
    pctSampled: response.data?.pctSampled ?? 0,
    includeErr: response.data?.includeErr ?? false,
  };
}

function normalizeFilterResult(
  expectedType: FilterTypes,
  result: PromiseSettledResult<GetFilterResponse>,
): ManagedFilter {
  if (result.status === "rejected") {
    return defaultFilters[expectedType];
  }

  return normalizeFilterResponse(expectedType, result.value);
}

export function useManageFilters() {
  const { connectionScope } = useClarityStore(
    useShallow(({ connectionScope }) => ({
      connectionScope,
    })),
  );
  const [filters, setFilters] = useState<Record<
    FilterTypes,
    ManagedFilter
  > | null>(null);
  const [filtersLoading, setFiltersLoading] = useState<Set<FilterTypes>>(
    new Set(),
  );
  const connectionName = connectionScope?.connectionName;
  const namespace = connectionScope?.namespace;

  useEffect(() => {
    if (!connectionName) return;

    async function fetchFilters() {
      setFiltersLoading(new Set<FilterTypes>(bothFilterTypes));

      const [logFilterResponse, traceFilterResponse] = await Promise.allSettled(
        bothFilterTypes.map((type) =>
          filterServiceClient.getFilter({
            connectionName,
            namespace,
            type: toFilterType(type),
          }),
        ),
      );

      setFilters({
        [FilterTypes.LOG]: normalizeFilterResult(
          FilterTypes.LOG,
          logFilterResponse,
        ),
        [FilterTypes.TRACE]: normalizeFilterResult(
          FilterTypes.TRACE,
          traceFilterResponse,
        ),
      });
      setFiltersLoading(new Set());
    }

    void fetchFilters();
  }, [connectionName, namespace]);

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
            [FilterTypes.LOG]: state?.[FilterTypes.LOG] ?? {
              type: FilterTypes.LOG,
              configured: false,
              pctSampled: 0,
              includeErr: false,
            },
            [FilterTypes.TRACE]: state?.[FilterTypes.TRACE] ?? {
              type: FilterTypes.TRACE,
              configured: false,
              pctSampled: 0,
              includeErr: false,
            },
            [type]: {
              type,
              configured: true,
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
      ...filters?.[FilterTypes.LOG],
      loading: filtersLoading.has(FilterTypes.LOG),
      updateLogsFilter: (pctSampled: number, includeErr: boolean) =>
        handleApplyFilter(FilterTypes.LOG, pctSampled, includeErr),
    },
    traceFilter: {
      ...filters?.[FilterTypes.TRACE],
      loading: filtersLoading.has(FilterTypes.TRACE),
      updateTracesFilter: (pctSampled: number, includeErr: boolean) =>
        handleApplyFilter(FilterTypes.TRACE, pctSampled, includeErr),
    },
  };
}
