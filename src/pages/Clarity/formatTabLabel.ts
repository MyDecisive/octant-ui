export function formatTabLabel(text: string, resultCount?: number) {
  if (resultCount !== undefined) {
    return `${text} (${resultCount.toString()})`;
  }

  return text;
}
