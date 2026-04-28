export type NormalizedApiError = {
  code: string;
  message: string;
  details?: unknown;
  retryable: boolean;
  status?: number;
  fieldErrors?: Record<string, string>;
  requestId?: string;
};

export class OctantApiError extends Error implements NormalizedApiError {
  code: string;
  details?: unknown;
  retryable: boolean;
  status?: number;
  fieldErrors?: Record<string, string>;
  requestId?: string;

  constructor(error: NormalizedApiError) {
    super(error.message);
    this.name = "OctantApiError";
    this.code = error.code;
    this.details = error.details;
    this.retryable = error.retryable;
    this.status = error.status;
    this.fieldErrors = error.fieldErrors;
    this.requestId = error.requestId;
  }
}

type ErrorLike = {
  code?: unknown;
  message?: unknown;
  details?: unknown;
  retryable?: unknown;
  status?: unknown;
  fieldErrors?: unknown;
  requestId?: unknown;
};

const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFieldErrors(value: unknown): value is Record<string, string> {
  return (
    isRecord(value) &&
    Object.values(value).every((fieldError) => typeof fieldError === "string")
  );
}

function normalizeCode(status?: number): string {
  if (status === 400 || status === 422) return "VALIDATION_ERROR";
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  if (status === 429) return "RATE_LIMITED";
  if (status === 408) return "TIMEOUT";
  if (status && status >= 500) return "UPSTREAM_UNAVAILABLE";

  return "UNKNOWN_ERROR";
}

export function normalizeApiError(error: unknown): OctantApiError {
  if (error instanceof OctantApiError) {
    return error;
  }

  if (isRecord(error)) {
    const errorLike = error as ErrorLike;
    const status =
      typeof errorLike.status === "number" ? errorLike.status : undefined;
    const code =
      typeof errorLike.code === "string" ? errorLike.code : normalizeCode(status);
    const message =
      typeof errorLike.message === "string"
        ? errorLike.message
        : "An unexpected error occurred.";

    return new OctantApiError({
      code,
      message,
      details: errorLike.details,
      retryable:
        typeof errorLike.retryable === "boolean"
          ? errorLike.retryable
          : status !== undefined && RETRYABLE_STATUS_CODES.has(status),
      status,
      fieldErrors: isFieldErrors(errorLike.fieldErrors)
        ? errorLike.fieldErrors
        : undefined,
      requestId:
        typeof errorLike.requestId === "string" ? errorLike.requestId : undefined,
    });
  }

  if (error instanceof Error) {
    return new OctantApiError({
      code: "UNKNOWN_ERROR",
      message: error.message,
      retryable: false,
    });
  }

  return new OctantApiError({
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred.",
    details: error,
    retryable: false,
  });
}

export async function normalizeFetchError(
  response: Response,
): Promise<OctantApiError> {
  let payload: unknown;

  try {
    payload = await response.clone().json();
  } catch {
    payload = await response.text();
  }

  if (isRecord(payload)) {
    const bodyError = isRecord(payload.error) ? payload.error : payload;

    return normalizeApiError({
      ...bodyError,
      status: response.status,
      requestId:
        typeof payload.requestId === "string" ? payload.requestId : undefined,
    });
  }

  return normalizeApiError({
    status: response.status,
    message: payload || `HTTP ${response.status}: ${response.statusText}`,
  });
}
