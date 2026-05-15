import { createClient } from "@connectrpc/connect";
import { TimeframeService } from "@mydecisiveai/octant-client";
import { transport } from "./transport";

export const timeframeServiceClient = createClient(TimeframeService, transport);
