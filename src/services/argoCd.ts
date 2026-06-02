import { createClient } from "@connectrpc/connect";
import { ArgoCDService } from "@mydecisiveai/octant-client";
import { mockTransport } from "./mockData/argoCd.mock";
import { transport } from "./transport";

export const argoCdServiceClient = createClient(
  ArgoCDService,
  import.meta.env.VITE_USE_MOCKS === "true" ? mockTransport : transport,
);
