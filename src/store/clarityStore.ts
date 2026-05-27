import type { SelectOption } from "@components/formInputs/Select";
import { Timeframe } from "@mydecisiveai/octant-client";
import { create } from "zustand";

interface ClarityState {
  selectedTimeframe: Timeframe;
  timeframeOptions: SelectOption[];
  logData?: boolean;
  traceData?: boolean;
}

interface Actions {
  setState: (
    key: keyof ClarityState,
    value: ClarityState[keyof ClarityState],
  ) => void;
}

type ClarityStore = ClarityState & Actions;

export const useClarityStore = create<ClarityStore>()((set) => ({
  selectedTimeframe: Timeframe.TIMEFRAME_24HR,
  timeframeOptions: [],
  setState: (key, value) => set((state) => ({ ...state, [key]: value })),
}));
