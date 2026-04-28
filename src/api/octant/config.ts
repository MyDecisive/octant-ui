export type OctantApiConfig = {
  baseUrl: string;
  timeoutMs: number;
  enableDebugLogging: boolean;
};

function getStringEnv(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function getOctantApiConfig(): OctantApiConfig {
  return {
    baseUrl:
      getStringEnv(import.meta.env.VITE_OCTANT_API_BASE_URL) ??
      getStringEnv(import.meta.env.VITE_API_BASE_URL) ??
      "/api",
    timeoutMs: Number(
      getStringEnv(import.meta.env.VITE_OCTANT_API_TIMEOUT_MS) ?? 30_000,
    ),
    enableDebugLogging: import.meta.env.DEV === true,
  };
}
