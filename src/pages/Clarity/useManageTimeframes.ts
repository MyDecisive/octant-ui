import type { SelectOption } from "@components/formInputs/Select";
import {
  Timeframe,
  TimeframeStatusResponse_Code,
} from "@mydecisiveai/octant-client";
import { useClarityStore } from "@store/clarityStore";
import { useOctantStore } from "@store/octantStore";
import {
  timeframeLabels,
  timeframeToPickerOptions,
} from "@utils/timeframeToPickerOptions";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { timeframeServiceClient } from "../../services/timeframe";

export function useManageTimeframes() {
  const { connectionName, namespace } = useOctantStore(
    useShallow((state) => ({
      connectionName: state.connectionName,
      namespace: state.namespace,
    })),
  );
  const { setState, timeRange } = useClarityStore(
    useShallow((state) => ({
      setState: state.setState,
      timeRange: state.timeRange,
    })),
  );
  const [pickerOptions, setPickerOptions] = useState<SelectOption[]>([]);
  const [hasLogTimeframeData, setHasLogTimeframeData] = useState(false);
  const [hasTraceTimeframeData, setHasTraceTimeframeData] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchPickerOptions() {
      if (!connectionName || !namespace) {
        setPickerOptions([]);
        setHasLogTimeframeData(false);
        setHasTraceTimeframeData(false);
        return;
      }

      setLoading(true);

      try {
        const { statuses, trace, log } =
          await timeframeServiceClient.timeframeStatus({
            namespace,
            connectionName,
          });

        if (ignore) return;

        const options = timeframeToPickerOptions(statuses);
        const selectedStatus = statuses.find(
          ({ timeframe }) => timeframe === timeRange,
        );
        const selectedTimeframeIsSelectable =
          selectedStatus?.status === TimeframeStatusResponse_Code.OK;
        const firstSelectableTimeframe = statuses.find(
          ({ status, timeframe }) =>
            timeframe !== Timeframe.TIMEFRAME_UNSPECIFIED &&
            status === TimeframeStatusResponse_Code.OK,
        )?.timeframe;

        if (!selectedTimeframeIsSelectable && firstSelectableTimeframe) {
          setState("timeRange", firstSelectableTimeframe);
        }

        setPickerOptions(options);
        setHasLogTimeframeData(log);
        setHasTraceTimeframeData(trace);
      } catch {
        if (!ignore) {
          setPickerOptions([]);
          setHasLogTimeframeData(false);
          setHasTraceTimeframeData(false);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void fetchPickerOptions();

    return () => {
      ignore = true;
    };
  }, [connectionName, namespace, setState, timeRange]);

  return {
    hasLogTimeframeData,
    hasTraceTimeframeData,
    loading,
    pickerOptions,
    selectedTimeRange: String(timeRange),
    setSelectedTimeRange: (nextTimeRange: string) => {
      setState("timeRange", Number(nextTimeRange));
    },
    timeRangeLabel: timeframeLabels[timeRange],
  };
}
