const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? window.location.origin;

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
  }).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json() as Promise<T>;
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
