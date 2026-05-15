import { create } from "zustand";
import { persist } from "zustand/middleware";

// TODO: When we get app state wired up, this is where meta info required for network calls should live
interface OctantState {
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

export const useOctantStore = create<OctantStore>()(
  persist(
    (set) => ({
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
