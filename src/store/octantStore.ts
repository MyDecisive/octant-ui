import { Timeframe } from "@mydecisiveai/octant-client";
import { create } from "zustand";

// TODO: When we get app state wired up, this is where meta info required for network calls should live
interface OctantState {
  timeRange: Timeframe;
  connectionName?: string;
  namespace?: string;
}

interface Actions {
  setState: (
    key: keyof OctantState,
    value: OctantState[keyof OctantState],
  ) => void;
}

type OctantStore = OctantState & Actions;

export const useOctantStore = create<OctantStore>()((set) => ({
  timeRange: Timeframe.TIMEFRAME_24HR,
  setState: (key, value) => set((state) => ({ ...state, [key]: value })),
}));
