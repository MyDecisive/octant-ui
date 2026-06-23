import {
  UpdateFilterResponse_Status,
  type GetFilterResponse,
} from "@mydecisiveai/octant-client";
import { useClarityStore, type ClarityState } from "@store/clarity/store";
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

function makeFilterDataByTypeSelector(filterType: FilterTypes) {
  return (state: ClarityState) => ({
    filter: state.filters[filterType],
    configured: state.configured[filterType],
    hasData: state.hasData[filterType],
  });
}

export function useManageFilter(filterType: FilterTypes) {
  const { connectionScope, update } = useClarityStore(
    useShallow(({ connectionScope, update }) => ({
      connectionScope,
      update,
    })),
  );

  const filterDataByTypeSelector = useMemo(() => {
    return makeFilterDataByTypeSelector(filterType);
  }, [filterType]);

  const { filter, configured } = useClarityStore(
    useShallow(filterDataByTypeSelector),
  );

  const [loading, setLoading] = useState<boolean>(false);

  const handleUpsertFilter = useCallback(
    (filter: UIFilter) => {
      update((prev) => ({
        ...prev,
        filters: {
          ...prev.filters,
          [filterType]: filter,
        },
      }));
    },
    [update, filterType],
  );

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
        handleUpsertFilter(normalizedResult);
      } catch {
        handleUpsertFilter({
          type: filterType,
          pctSampled: 0,
          includeErr: false,
        });
      } finally {
        setLoading(false);
      }
    }

    void fetchFilters();
  }, [connectionName, namespace, handleUpsertFilter, filterType]);

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
            handleUpsertFilter({
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
    [connectionScope, filterType, handleUpsertFilter],
  );

  return {
    configured,
    filter,
    loading,
    handleApplyFilter,
  };
}
