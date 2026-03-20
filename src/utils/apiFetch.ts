const DEFAULT_BASE_URL = "/api";

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

const BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL,
);

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  return fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  }).then(async (res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

    if (res.status === 204) {
      return undefined as T;
    }

    const text = await res.text();

    if (!text) {
      return undefined as T;
    }

    return JSON.parse(text) as T;
  });
}

apiFetch.get = <T>(path: string, opts: Omit<FetchOptions, "method"> = {}) =>
  apiFetch<T>(path, { ...opts, method: "GET" });
apiFetch.post = <T>(path: string, opts: Omit<FetchOptions, "method"> = {}) =>
  apiFetch<T>(path, { ...opts, method: "POST" });
apiFetch.put = <T>(path: string, opts: Omit<FetchOptions, "method"> = {}) =>
  apiFetch<T>(path, { ...opts, method: "PUT" });
apiFetch.delete = <T>(path: string, opts: Omit<FetchOptions, "method"> = {}) =>
  apiFetch<T>(path, { ...opts, method: "DELETE" });

export { apiFetch };
