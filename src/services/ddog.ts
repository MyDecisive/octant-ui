import { createClient } from "@connectrpc/connect";
import { DatadogService } from "@mydecisiveai/octant-client";
import { mockTransport } from "./mockData/ddog.mock";
import { transport } from "./transport";

export const dDogServiceClient = createClient(
  DatadogService,
  import.meta.env.VITE_USE_MOCKS === "true" ? mockTransport : transport,
);
