import { createClient } from "@connectrpc/connect";
import { BudgetService } from "@mydecisiveai/octant-client";
import { mockTransport } from "./mockData/budget.mock";
import { transport } from "./transport";

export const budgetServiceClient = createClient(
  BudgetService,
  import.meta.env.VITE_USE_MOCKS === "true" ? mockTransport : transport,
);
