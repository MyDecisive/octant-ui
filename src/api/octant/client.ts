import { getOctantApiConfig } from "./config";
import { normalizeApiError, normalizeFetchError } from "./errors";
import type { OctantRequestMeta } from "./types";

type OctantFetchOptions = OctantRequestMeta & {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

const config = getOctantApiConfig();

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function withRequestMeta(
  headers: Record<string, string>,
  meta: OctantRequestMeta,
) {
  return {
    ...headers,
    ...(meta.requestId ? { "X-Request-Id": meta.requestId } : {}),
    ...(meta.correlationId
      ? { "X-Correlation-Id": meta.correlationId }
      : {}),
  };
}

function getRequestId() {
  return crypto.randomUUID();
}

async function request(path: string, options: OctantFetchOptions = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    requestId = getRequestId(),
    correlationId,
    signal,
  } = options;
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(
    () => controller.abort(),
    config.timeoutMs,
  );

  signal?.addEventListener("abort", () => controller.abort(), { once: true });

  try {
    const response = await fetch(`${normalizeBaseUrl(config.baseUrl)}${path}`, {
      method,
      headers: withRequestMeta(
        {
          "Content-Type": "application/json",
          ...headers,
        },
        { requestId, correlationId },
      ),
      signal: controller.signal,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      throw await normalizeFetchError(response);
    }

    return response;
  } catch (error) {
    throw normalizeApiError(error);
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

async function json<T>(path: string, options: OctantFetchOptions = {}) {
  const response = await request(path, options);

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export const octantClient = {
  get: <T>(path: string, options: Omit<OctantFetchOptions, "method"> = {}) =>
    json<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, options: Omit<OctantFetchOptions, "method"> = {}) =>
    json<T>(path, { ...options, method: "POST" }),
  put: <T>(path: string, options: Omit<OctantFetchOptions, "method"> = {}) =>
    json<T>(path, { ...options, method: "PUT" }),
  delete: <T>(path: string, options: Omit<OctantFetchOptions, "method"> = {}) =>
    json<T>(path, { ...options, method: "DELETE" }),
  request,
};
