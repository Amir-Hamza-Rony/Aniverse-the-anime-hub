/**
 * Client-side API fetch helper that sends cookies (including httpOnly auth
 * cookies) with same-origin requests. Defaults to no-store caching so admin
 * dashboards always read fresh data.
 */
export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  return fetch(input, {
    cache: "no-store",
    credentials: "include",
    ...init,
    headers: {
      ...(init.headers || {}),
      "Content-Type": "application/json",
    },
  });
}

export async function apiJson<T = unknown>(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<T> {
  const res = await apiFetch(input, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}
