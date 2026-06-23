import {
  UpdateFilterResponse_Status,
  type GetFilterResponse,
} from "@mydecisiveai/octant-client";
import { useClarityStore } from "@store/clarity/store";
import { FilterTypes, type UIFilter } from "@types";
import { toFilterType } from "@utils/toFilterTypes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { filterServiceClient } from "../../services/filter";

function normalizeFilterResult(
  type: FilterTypes,
  result: GetFilterResponse,
): UIFilter {
  return {
    type,
    pctSampled: result?.data?.pctSampled ?? 0,
    includeErr: result?.data?.includeErr ?? false,
  };
}

export function useManageFilter(filterType: FilterTypes) {
  const {
    connectionScope,
    logsConfigured,
    tracesConfigured,
    setState,
    logFilter,
    traceFilter,
  } = useClarityStore(
    useShallow(
      ({
        connectionScope,
        logsConfigured,
        tracesConfigured,
        setState,
        logFilter,
        traceFilter,
      }) => ({
        connectionScope,
        setState,
        logFilter,
        traceFilter,
        logsConfigured,
        tracesConfigured,
      }),
    ),
  );

  const filterStateKey = useMemo(
    () => (filterType === FilterTypes.LOG ? "logFilter" : "traceFilter"),
    [filterType],
  );

  const configured = useMemo(() => {
    return filterType === FilterTypes.LOG ? logsConfigured : tracesConfigured;
  }, [filterType, logsConfigured, tracesConfigured]);

  const filter = useMemo(
    () => (filterType === FilterTypes.LOG ? logFilter : traceFilter),
    [filterType, logFilter, traceFilter],
  );

  const [loading, setLoading] = useState<boolean>(false);

  const connectionName = connectionScope?.connectionName;
  const namespace = connectionScope?.namespace;

  useEffect(() => {
    if (!connectionName) return;

    async function fetchFilters() {
      setLoading(true);

      try {
        const filterResponse = await filterServiceClient.getFilter({
          connectionName,
          namespace,
          type: toFilterType(filterType),
        });

        const normalizedResult = normalizeFilterResult(
          filterType,
          filterResponse,
        );
        setState(filterStateKey, normalizedResult);
      } catch {
        setState(filterStateKey, {
          type: filterType,
          pctSampled: 0,
          includeErr: false,
        });
      } finally {
        setLoading(false);
      }
    }

    void fetchFilters();
  }, [connectionName, namespace, setState, filterStateKey, filterType]);

  const handleApplyFilter = useCallback(
    async (pctSampled: number, includeErr: boolean) => {
      setLoading(true);

      try {
        for await (const res of filterServiceClient.updateFilter({
          data: {
            type: toFilterType(filterType),
            pctSampled,
            includeErr,
          },
          ...connectionScope,
        })) {
          const status = res.status;
          if (status === UpdateFilterResponse_Status.COMPLETED) {
            setState(filterStateKey, {
              type: filterType,
              pctSampled,
              includeErr,
            });
            break;
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [connectionScope, filterType, filterStateKey, setState],
  );

  return {
    configured,
    filter,
    loading,
    handleApplyFilter,
  };
}
