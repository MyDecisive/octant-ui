import { createClient } from "@connectrpc/connect";
import { DatadogService } from "@mydecisiveai/octant-client";
import { transport } from "../api/transport";

export const dDogServiceClient = createClient(DatadogService, transport);
