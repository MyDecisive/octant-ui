import type { UIConnectionData, UIConnectionScope } from "@types";
import { create } from "zustand";

interface OctantState {
  connection?: Partial<UIConnectionData>;
  hubInstalled?: boolean;
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
  setInConnectionScope: (
    key: keyof UIConnectionScope,
    value: UIConnectionScope[keyof UIConnectionScope],
  ) => void;
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
  setInConnectionScope: (key, value) =>
    set((state) => ({
      ...state,
      connection: {
        ...state.connection,
        scope: {
          ...(state.connection?.scope || {}),
          [key]: value,
        },
      },
    })),
}));
