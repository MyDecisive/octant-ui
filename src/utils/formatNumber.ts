interface FormatNumberOptions {
  decimalPlaces?: number;
  minimumDecimalPlaces?: number;
  prefix?: string;
  suffix?: string;
}

export function formatNumber(
  value: number | undefined,
  {
    decimalPlaces = 2,
    minimumDecimalPlaces = 0,
    prefix = "",
    suffix = "",
  }: FormatNumberOptions = {},
) {
  if (value === undefined) {
    return "-";
  }

  const formattedValue = value.toLocaleString(undefined, {
    minimumFractionDigits: minimumDecimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
  return `${prefix}${formattedValue}${suffix}`;
}
