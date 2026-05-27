import { useClarityStore } from "@store/clarityStore";
import { useShallow } from "zustand/shallow";

export function useManageTimeframes() {
  const { setSelectedTimeframe, selectedTimeframe, timeframeOptions } =
    useClarityStore(
      useShallow(({ setState, selectedTimeframe, timeframeOptions }) => ({
        setSelectedTimeframe: (nextTimeframe: string) => {
          setState("selectedTimeframe", parseInt(nextTimeframe));
        },
        selectedTimeframe,
        timeframeOptions,
      })),
    );

  return {
    selectedTimeframe,
    timeframeOptions,
    setSelectedTimeframe,
  };
}
