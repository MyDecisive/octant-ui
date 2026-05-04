const protocolRegex = /^[a-z][a-z\d+.-]*:\/\//i;
const hostnameRegex =
  /^(localhost|(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)+[a-z]{2,63})$/i;

function parseUrlInput(value: string): URL | undefined {
  const trimmedValue = value.trim();
  const urlValue = protocolRegex.test(trimmedValue)
    ? trimmedValue
    : `http://${trimmedValue}`;

  try {
    return new URL(urlValue);
  } catch {
    return undefined;
  }
}

export function validateUrlInput(value: string) {
  const url = parseUrlInput(value);

  if (
    url &&
    (url.protocol === "http:" || url.protocol === "https:") &&
    hostnameRegex.test(url.hostname)
  ) {
    return undefined;
  }

  return "Enter a valid URL. Expected format: http://www.abc.com or localhost:8080";
}
