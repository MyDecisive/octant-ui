import type { DataFidelityResponse } from "@types";

export type FidelityCellValues = "loading" | boolean | null;

interface BaseRowDefinition {
  id: keyof DataFidelityResponse;
  label: string;
  value: unknown;
}

export interface DataFidelityCell extends BaseRowDefinition {
  value: FidelityCellValues;
}

export interface FidelityDetailsCell extends BaseRowDefinition {
  value: null | string;
}

export type RowType = DataFidelityCell | FidelityDetailsCell;
