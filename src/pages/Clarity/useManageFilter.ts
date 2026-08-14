import type { UIFilter } from "@app-types/contracts";
import type { UIFilterType } from "@app-types/enums";
import {
  UpdateFilterResponse_Status,
  type GetFilterResponse,
} from "@mydecisiveai/octant-client";
import { useClarityStore, type ClarityState } from "@store/clarity/store";
import { toFilterType } from "@utils/toFilterType";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { filterServiceClient } from "../../services/filter";

function normalizeFilterResult(
  type: UIFilterType,
  result: GetFilterResponse,
): UIFilter {
  return {
    type,
    pctSampled: result?.data?.pctSampled ?? 0,
    includeErr: result?.data?.includeErr ?? false,
  };
}

function makeFilterDataByTypeSelector(filterType: UIFilterType) {
  return (state: ClarityState) => {
    const overallByType = (state.overall ?? {})[filterType];
    return {
      configured: state.configured[filterType],
      hasData: state.hasData[filterType],
      ...state.filters[filterType],
      ...(overallByType && {
        received: overallByType.received,
        sent: overallByType.sent,
        filtered: overallByType.filtered,
      }),
    };
  };
}

export function useManageFilter(filterType: UIFilterType) {
  const { connectionScope, update } = useClarityStore(
    useShallow(({ connectionScope, update }) => ({
      connectionScope,
      update,
    })),
  );

  const filterDataByTypeSelector = useMemo(() => {
    return makeFilterDataByTypeSelector(filterType);
  }, [filterType]);

  const { configured, ...controlData } = useClarityStore(
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
    controlData,
    loading,
    handleApplyFilter,
  };
}
