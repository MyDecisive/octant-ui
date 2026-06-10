export function getStringEnv(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}
