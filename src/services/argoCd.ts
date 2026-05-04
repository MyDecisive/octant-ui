import { createClient } from "@connectrpc/connect";
import { ArgoCDService } from "@mydecisiveai/octant-client";
import { transport } from "../api/transport";

export const argoCdServiceClient = createClient(ArgoCDService, transport);
