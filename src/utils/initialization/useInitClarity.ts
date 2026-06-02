import {
  Timeframe,
  TimeframeStatusResponse_Code,
  type ConnectionScope,
  type TimeframeStatusRequest,
} from "@mydecisiveai/octant-client";
import { useClarityStore } from "@store/clarityStore";
import { timeframeToPickerOptions } from "@utils/timeframeToPickerOptions";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { timeframeServiceClient } from "../../services/timeframe";

export function useInitClarity({
  connectionScope,
}: {
  connectionScope?: ConnectionScope;
}) {
  const [loading, setLoading] = useState(false);
  const [hasRan, setHasRan] = useState(false);

  const { setState } = useClarityStore(
    useShallow(({ setState }) => ({
      setState,
    })),
  );

  useEffect(() => {
    let ignore = false;

    async function fetchPickerOptions() {
      setLoading(true);
      try {
        // TODO: Are these flags for log/trace indicative of selected data type?
        const { statuses, trace, log } =
          await timeframeServiceClient.timeframeStatus(
            connectionScope as Pick<
              TimeframeStatusRequest,
              "connectionName" | "namespace"
            >,
          );

        if (ignore) return;

        if (statuses.length) {
          const options = timeframeToPickerOptions(statuses);

          const firstSelectableTimeframe = statuses.find(
            ({ status, timeframe }) =>
              timeframe !== Timeframe.TIMEFRAME_UNSPECIFIED &&
              status === TimeframeStatusResponse_Code.OK,
          )?.timeframe;

          if (firstSelectableTimeframe) {
            setState("selectedTimeframe", firstSelectableTimeframe);
          } else if (options[0]?.value) {
            setState("selectedTimeframe", parseInt(options[0].value));
          }
          setState("timeframeOptions", options);
        }
        setState("logData", log);
        setState("traceData", trace);
      } catch {
        if (!ignore) {
          setState("logData", false);
          setState("traceData", false);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
          setHasRan(true);
        }
      }
    }

    if (connectionScope && !hasRan) {
      void fetchPickerOptions();
    }

    return () => {
      ignore = true;
    };
  }, [connectionScope, hasRan, setState]);

  return loading;
}
