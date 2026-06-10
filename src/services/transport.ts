import { createConnectTransport } from "@connectrpc/connect-web";
import { getStringEnv } from "@utils/getStringEnv";

export const transport = createConnectTransport({
  baseUrl:
    getStringEnv(import.meta.env.VITE_OCTANT_API_BASE_URL) ??
    getStringEnv(import.meta.env.VITE_API_BASE_URL) ??
    getStringEnv(import.meta.env.VITE_API_URL) ??
    "/api",
  jsonOptions: {
    alwaysEmitImplicit: true,
  },
});
