import { Timeframe } from "@mydecisiveai/octant-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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

// Added local storage for clarity, need to find a better way
export const useOctantStore = create<OctantStore>()(
  persist(
    (set) => ({
      timeRange: Timeframe.TIMEFRAME_24HR,
      setState: (key, value) => set((state) => ({ ...state, [key]: value })),
    }),
    {
      name: "octant-store",
      partialize: ({ connectionName, namespace }) => ({
        connectionName,
        namespace,
      }),
    },
  ),
);
