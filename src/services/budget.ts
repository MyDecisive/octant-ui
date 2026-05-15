import { createClient } from "@connectrpc/connect";
import { BudgetService } from "@mydecisiveai/octant-client";
import { transport } from "./transport";

export const budgetServiceClient = createClient(BudgetService, transport);
