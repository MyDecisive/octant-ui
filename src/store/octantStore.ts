import type { UIConnectionData } from "@app-types/contracts";
import { create } from "zustand";

interface OctantState {
  connection?: Partial<UIConnectionData>;
}
interface Actions {
  setState: (
    key: keyof OctantState,
    value: OctantState[keyof OctantState],
  ) => void;
  setInConnection: (
    key: keyof UIConnectionData,
    value: UIConnectionData[keyof UIConnectionData],
  ) => void;
  // TODO: Removing `setInConnectionScope` satisfies types and UX flows, but reopens a bug that needs to be solved in that OctantStore does not get updated with connection information during the IxC flow.
}

type OctantStore = OctantState & Actions;

export const useOctantStore = create<OctantStore>()((set) => ({
  setState: (key, value) => set((state) => ({ ...state, [key]: value })),
  setInConnection: (key, value) =>
    set((state) => ({
      ...state,
      connection: {
        ...state.connection,
        [key]: value,
      },
    })),
}));
