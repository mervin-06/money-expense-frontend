const API_BASE =
  import.meta.env.VITE_SERVER_APP_URL ||
  "https://money-expense-backend-production.up.railway.app";

type ApiOptions = RequestInit & {
  token?: string | null;
};

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      signal: controller.signal, 
    });
  } catch (err) {
    clearTimeout(timeout);
    throw new Error("Request timed out or network error");
  }

  clearTimeout(timeout);

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
}

export { API_BASE };