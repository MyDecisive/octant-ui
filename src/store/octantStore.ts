import type { ConnectionData } from "@mydecisiveai/octant-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ValidationSnapshot {
  receivingData: boolean;
  sendingData: boolean;
  dataIntegrity: boolean;
  clientsConnected: boolean;
  timestamp: string;
}

interface OctantState {
  connection?: ConnectionData;
  validation?: ValidationSnapshot;
  hubInstalled?: boolean;
}

interface Actions {
  setState: (
    key: keyof OctantState,
    value: OctantState[keyof OctantState],
  ) => void;
}

type OctantStore = OctantState & Actions;

export const useOctantStore = create<OctantStore>()(
  persist(
    (set) => ({
      setState: (key, value) => set((state) => ({ ...state, [key]: value })),
    }),
    {
      name: "octant-store",
      partialize: ({ validation }) => ({
        validation,
      }),
    },
  ),
);
