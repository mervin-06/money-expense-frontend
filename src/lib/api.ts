const API_BASE =
  import.meta.env.VITE_SERVER_APP_URL ||
  "https://money-expense-backend-production.up.railway.app";

const REQUEST_TIMEOUT_MS = 30000; // 30 seconds - Railway may need time to wake up

type ApiOptions = RequestInit & {
  token?: string | null;
  timeout?: number;
};

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { token, headers, timeout = REQUEST_TIMEOUT_MS, ...rest } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...rest,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });

    const raw = await response.text();

    let data: any;
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      throw new Error("Invalid JSON response from server");
    }

    if (!response.ok) {
      const message =
        typeof data === "object" && data && "message" in data
          ? String(data.message)
          : "Request failed";
      throw new Error(message);
    }

    return data as T;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error(
        `Request timeout after ${timeout}ms. Backend may be offline or slow to respond. Check Network tab in DevTools.`
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export { API_BASE };