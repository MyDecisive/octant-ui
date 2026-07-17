export function formatTimestamp(timestamp?: string) {
  if (!timestamp) return undefined;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}
