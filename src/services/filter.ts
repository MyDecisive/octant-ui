import { createClient } from "@connectrpc/connect";
import { FilterService } from "@mydecisiveai/octant-client";
import { mockTransport } from "./mockData/filter.mock";
import { transport } from "./transport";

export const filterServiceClient = createClient(
  FilterService,
  import.meta.env.VITE_USE_MOCKS === "true" ? mockTransport : transport,
);
