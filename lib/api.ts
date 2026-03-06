const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((customHeaders as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers,
    ...rest,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error ${res.status}`);
  }

  return res.json();
}

// Auth helpers
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

export function setToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

export function removeToken(): void {
  localStorage.removeItem("auth_token");
}

export function getUserData(): { id: number; nombre: string; email: string; rol: string } | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("user_data");
  return data ? JSON.parse(data) : null;
}

export function setUserData(data: { id: number; nombre: string; email: string; rol: string }): void {
  localStorage.setItem("user_data", JSON.stringify(data));
}

export function removeUserData(): void {
  localStorage.removeItem("user_data");
}

export function logout(): void {
  removeToken();
  removeUserData();
  window.location.href = "/login";
}

export { API_BASE };
