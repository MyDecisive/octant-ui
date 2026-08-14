export function formatTimestamp(timestamp?: string) {
  if (!timestamp) return undefined;
  const dateFromTimestamp = new Date(timestamp);

  if (isNaN(dateFromTimestamp.getTime())) return undefined;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(dateFromTimestamp);
}
