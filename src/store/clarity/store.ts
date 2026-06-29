import { useContext } from "react";
import { createStore, useStore } from "zustand";
import { ClarityContext } from "../../contexts/Clarity";
import { type BudgetSlice, createDefaultBudgetSlice } from "./budget.slice";
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

/**
 * NoOverlap and MergeSlices are utility types that will help protect from
 * collisions with top level keys.
 */
type NoOverlap<T, U> = keyof T & keyof U extends never ? U : never;

type MergeSlices<T extends unknown[]> = T extends [infer First, ...infer Rest]
  ? First & NoOverlap<First, MergeSlices<Rest>>
  : object;

type ClarityData = MergeSlices<
  [InitSlice, TimeframeSlice, FiltersSlice, BudgetSlice]
>;
export interface ClarityState extends ClarityData {
  setState: (
    key: keyof ClarityData,
    value: ClarityData[keyof ClarityData],
  ) => void;
  update: (
    updater: Partial<ClarityData> | ((prev: ClarityData) => ClarityData),
  ) => void;
}

export type ClarityStore = ReturnType<typeof createClarityStore>;

export const createClarityStore = (initProps?: ClarityStoreInitProps) => {
  return createStore<ClarityState>()((set) => ({
    ...createDefaultInitSlice(initProps),
    ...createDefaultTimeframeSlice(),
    ...createDefaultFiltersSlice(),
    ...createDefaultBudgetSlice(),
    setState: (key, value) => set((state) => ({ ...state, [key]: value })),
    update: (
      updater: Partial<ClarityData> | ((prev: ClarityData) => ClarityData),
    ) =>
      set((state) => ({
        ...state,
        ...(typeof updater === "function" ? updater(state) : updater),
      })),
  }));
};

export function useClarityStore<T>(selector: (state: ClarityState) => T): T {
  const store = useContext(ClarityContext);
  if (!store) throw new Error("Missing ClarityContext Provider in the tree");
  return useStore(store, selector);
}
