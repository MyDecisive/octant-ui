import {
  Timeframe,
  TimeframeStatusResponse_Code,
  type TimeframeStatusRequest,
} from "@mydecisiveai/octant-client";
import { useClarityStore } from "@store/clarity/store";
import type { UIConnectionScope } from "@types";
import { timeframeToPickerOptions } from "@utils/timeframeToPickerOptions";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { timeframeServiceClient } from "../../services/timeframe";

export function useInitClarity({
  connectionScope,
}: {
  connectionScope?: UIConnectionScope;
}) {
  const [loading, setLoading] = useState(false);
  const hasRan = useRef(false);

  const { setState } = useClarityStore(
    useShallow(({ setState }) => ({ setState })),
  );

  useEffect(() => {
    if (!connectionScope || hasRan.current) return;
    hasRan.current = true;

    async function fetchPickerOptions() {
      setLoading(true);
      try {
        const { statuses, trace, log } =
          await timeframeServiceClient.timeframeStatus(
            connectionScope as Pick<
              TimeframeStatusRequest,
              "connectionName" | "namespace"
            >,
          );

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
        setState("hasLogData", log);
        setState("hasTraceData", trace);
      } catch {
        setState("hasLogData", false);
        setState("hasTraceData", false);
      } finally {
        setLoading(false);
      }
    }

    void fetchPickerOptions();
  }, [connectionScope, setState]);

  return loading;
}
