import { createConnectTransport } from "@connectrpc/connect-web";

function getStringEnv(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

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
