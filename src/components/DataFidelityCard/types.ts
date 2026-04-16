export type DataState = "loading" | boolean | null;

export interface FidelityState {
  receivingData: DataState;
  sendingData: DataState;
  dataIntegrity: DataState;
  details: null | string;
}
