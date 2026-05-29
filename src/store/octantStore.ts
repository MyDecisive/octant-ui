import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ValidationSnapshot {
  receivingData: boolean;
  sendingData: boolean;
  dataIntegrity: boolean;
  clientsConnected: boolean;
  timestamp: string;
}

// TODO: When we get app state wired up, this is where meta info required for network calls should live
interface OctantState {
  connectionName?: string;
  hubInstalled?: boolean;
  namespace?: string;
  validation?: ValidationSnapshot;
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
      partialize: ({ connectionName, hubInstalled, namespace, validation }) => ({
        connectionName,
        hubInstalled,
        namespace,
        validation,
      }),
    },
  ),
);
