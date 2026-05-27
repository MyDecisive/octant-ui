import {
  Timeframe,
  TimeframeStatusResponse_Code,
} from "@mydecisiveai/octant-client";
import { useClarityStore } from "@store/clarityStore";
import { useOctantStore } from "@store/octantStore";
import { timeframeToPickerOptions } from "@utils/timeframeToPickerOptions";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useShallow } from "zustand/shallow";
import { ROUTES } from "../../constants/routing";
import { timeframeServiceClient } from "../../services/timeframe";

export function useInitClarity() {
  const [, navigate] = useLocation();
  const { connectionName, namespace, hubInstalled } = useOctantStore(
    useShallow(({ connectionName, namespace, hubInstalled }) => ({
      connectionName,
      namespace,
      hubInstalled,
    })),
  );

  // TODO: This should probably be handled more gracefully.
  if (!connectionName || !namespace || !hubInstalled) {
    navigate(ROUTES.INSTALL);
  }

  const [loading, setLoading] = useState(false);

  const { setState } = useClarityStore(
    useShallow(({ setState, selectedTimeframe }) => ({
      setState,
      selectedTimeframe,
    })),
  );

  useEffect(() => {
    let ignore = false;

    async function fetchPickerOptions() {
      try {
        // TODO: Are these flags for log/trace indicative of selected data type?
        const { statuses, trace, log } =
          await timeframeServiceClient.timeframeStatus({
            namespace,
            connectionName,
          });

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
        }
      }
    }

    void fetchPickerOptions();

    return () => {
      ignore = true;
    };
  }, [connectionName, namespace, setState]);

  return loading;
}
