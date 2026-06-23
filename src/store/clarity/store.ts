import { useContext } from "react";
import { createStore, useStore } from "zustand";
import { ClarityContext } from "../../contexts/Clarity";
import { type FiltersSlice, createDefaultFiltersSlice } from "./filter.slice";
import {
  type ClarityStoreInitProps,
  type InitSlice,
  createDefaultInitSlice,
} from "./init.slice";
import {
  type TimeframeSlice,
  createDefaultTimeframeSlice,
} from "./timeframe.slice";

interface ClarityData extends InitSlice, TimeframeSlice, FiltersSlice {}

interface ClarityState extends ClarityData {
  setState: (
    key: keyof ClarityData,
    value: ClarityData[keyof ClarityData],
  ) => void;
}

export type ClarityStore = ReturnType<typeof createClarityStore>;

export const createClarityStore = (initProps?: ClarityStoreInitProps) => {
  return createStore<ClarityState>()((set) => ({
    ...createDefaultInitSlice(initProps),
    ...createDefaultTimeframeSlice(),
    ...createDefaultFiltersSlice(),
    setState: (key, value) => set((state) => ({ ...state, [key]: value })),
  }));
};

export function useClarityStore<T>(selector: (state: ClarityState) => T): T {
  const store = useContext(ClarityContext);
  if (!store) throw new Error("Missing ClarityContext Provider in the tree");
  return useStore(store, selector);
}
