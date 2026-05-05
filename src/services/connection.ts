import { createClient } from "@connectrpc/connect";
import { ConnectionService } from "@mydecisiveai/octant-client";
import { transport } from "../api/transport";

export const connectionServiceClient = createClient(
  ConnectionService,
  transport,
);
