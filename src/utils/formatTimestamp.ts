// TODO: Move to copy dir. String creators? Dynamic strings?
function formatTimestamp(timestamp?: string) {
  if (!timestamp) return undefined;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export function formatLastRun(timestamp?: string) {
  const formattedTimestamp = formatTimestamp(timestamp);

  return formattedTimestamp ? `Last run ${formattedTimestamp}` : undefined;
}
