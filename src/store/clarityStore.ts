import type { SelectOption } from "@components/formInputs/Select";
import { Timeframe } from "@mydecisiveai/octant-client";
import type { UIConnectionScope } from "@types";
import { useContext } from "react";
import { createStore, useStore } from "zustand";
import { ClarityContext } from "../contexts/Clarity";

interface ClarityData {
  selectedTimeframe: Timeframe;
  timeframeOptions: SelectOption[];
  logData?: boolean;
  traceData?: boolean;
  connectionScope?: UIConnectionScope;
}

interface ClarityState extends ClarityData {
  setState: (
    key: keyof ClarityData,
    value: ClarityData[keyof ClarityData],
  ) => void;
}

export type ClarityStore = ReturnType<typeof createClarityStore>;

function createDefaultClarityState(): ClarityData {
  return {
    selectedTimeframe: Timeframe.TIMEFRAME_24HR,
    timeframeOptions: [],
  };
}

export const createClarityStore = (initProps?: Partial<ClarityData>) => {
  const defaultState = createDefaultClarityState();

  return createStore<ClarityState>()((set) => ({
    ...defaultState,
    ...initProps,
    setState: (key: keyof ClarityData, value: ClarityData[keyof ClarityData]) =>
      set((state) => ({ ...state, [key]: value })),
  }));
};

export function useClarityStore<T>(selector: (state: ClarityState) => T): T {
  const store = useContext(ClarityContext);
  if (!store) throw new Error("Missing ClarityContext Provider in the tree");

  return useStore(store, selector);
}
