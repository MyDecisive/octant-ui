import { Timeframe } from "@mydecisiveai/octant-client";
import { create } from "zustand";

interface ClarityState {
  timeRange: Timeframe;
}

interface Actions {
  setState: (
    key: keyof ClarityState,
    value: ClarityState[keyof ClarityState],
  ) => void;
}

type ClarityStore = ClarityState & Actions;

// Added local storage for clarity, need to find a better way
export const useClarityStore = create<ClarityStore>()((set) => ({
  timeRange: Timeframe.TIMEFRAME_24HR,
  setState: (key, value) => set((state) => ({ ...state, [key]: value })),
}));
