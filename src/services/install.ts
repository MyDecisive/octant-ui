import { createClient } from "@connectrpc/connect";
import { InstallService } from "@mydecisiveai/octant-client";
import { transport } from "./transport";

export const installServiceClient = createClient(InstallService, transport);
