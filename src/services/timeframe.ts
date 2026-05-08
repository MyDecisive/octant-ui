import { createClient } from "@connectrpc/connect";
import { TimeframeService } from "@mydecisiveai/octant-client";
import { transport } from "../api/transport";

export const timeframeServiceClient = createClient(TimeframeService, transport);
