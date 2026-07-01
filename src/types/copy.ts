import type { ErrorModalActs, ErrorModalSeverity } from "./enums";

export type ErrorModalCTA = {
  text: string;
  act: ErrorModalActs[];
};
export type ErrorModalContent = {
  header: string;
  severity: ErrorModalSeverity;
  body?: string;
  showNetworkError?: boolean;
  actions: ErrorModalCTA[];
};
