import { useClarityStore } from "@store/clarity/store";
import { useCallback } from "react";
import { useShallow } from "zustand/shallow";

export function useManageTimeframes() {
  const { setState, selectedTimeframe, timeframeOptions } = useClarityStore(
    useShallow(({ setState, selectedTimeframe, timeframeOptions }) => ({
      setState,
      selectedTimeframe,
      timeframeOptions,
    })),
  );

  const setSelectedTimeframe = useCallback(
    (nextTimeframe: string) => {
      setState("selectedTimeframe", parseInt(nextTimeframe));
    },
    [setState],
  );

  return {
    selectedTimeframe,
    timeframeOptions,
    setSelectedTimeframe,
  };
}
