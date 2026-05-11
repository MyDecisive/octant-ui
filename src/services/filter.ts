import { createClient } from "@connectrpc/connect";
import { FilterService } from "@mydecisiveai/octant-client";
import { transport } from "../api/transport";

export const filterServiceClient = createClient(FilterService, transport);
