import {
  FilterType,
  UpdateFilterResponse_Status,
  type GetFilterResponse,
} from "@mydecisiveai/octant-client";
import { useClarityStore } from "@store/clarityStore";
import { type Filter, type FilterTypes } from "@types";
import { toFilterType } from "@utils/toFilterTypes";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { filterServiceClient } from "../../services/filter";

const bothFilterTypes: FilterTypes[] = ["logs", "traces"];

interface ManagedFilter extends Partial<Filter> {
  configured: boolean;
}

const defaultFilters: Record<FilterTypes, ManagedFilter> = {
  logs: {
    type: "logs",
    configured: false,
  },
  traces: {
    type: "traces",
    configured: false,
  },
};

function toFilterTypeName(type: FilterType): FilterTypes | undefined {
  switch (type) {
    case FilterType.LOG:
      return "logs";
    case FilterType.TRACE:
      return "traces";
    default:
      return undefined;
  }
}

function normalizeFilterResponse(
  expectedType: FilterTypes,
  response: GetFilterResponse,
): ManagedFilter {
  const dataType = response.data?.type;
  const type = dataType ? toFilterTypeName(dataType) : undefined;

  if (type !== expectedType) {
    return defaultFilters[expectedType];
  }

  return {
    type,
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
  const [filters, setFilters] =
    useState<Record<FilterTypes, ManagedFilter> | null>(null);
  const [filtersLoading, setFiltersLoading] = useState<Set<FilterTypes>>(
    new Set(),
  );

  useEffect(() => {
    async function fetchFilters() {
      setFiltersLoading(new Set<FilterTypes>(bothFilterTypes));

      const [logFilterResponse, traceFilterResponse] =
        await Promise.allSettled(
          bothFilterTypes.map((type) =>
            filterServiceClient.getFilter({
              ...connectionScope,
              type: toFilterType(type),
            }),
          ),
        );

      setFilters({
        logs: normalizeFilterResult("logs", logFilterResponse),
        traces: normalizeFilterResult("traces", traceFilterResponse),
      });
      setFiltersLoading(new Set());
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
              configured: false,
              pctSampled: 0,
              includeErr: false,
            },
            traces: state?.traces ?? {
              type: "traces",
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
