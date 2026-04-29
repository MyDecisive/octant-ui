const urlRegex = new RegExp(
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
);

export function validateUrlInput(value: string) {
  if (urlRegex.test(value)) {
    return undefined;
  }

  return "Enter a valid URL. Expected format: http://www.abc.com";
}
