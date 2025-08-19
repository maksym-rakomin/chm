import {TokenStorage} from "@/lib/types/token";

export function createAuthFetch(tokenStorage: TokenStorage) {

  async function refreshAccessToken() {
    const refreshTokenResponse = await tokenStorage.get();
    const refreshToken = refreshTokenResponse?.refreshToken ?? null;

    if (!refreshToken) throw new Error("No refresh token");

    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      await tokenStorage.clear();
      throw new Error("Refresh failed");
    }

    const data = await res.json();
    await tokenStorage.set(data);
    return data.accessToken;
  }

  return async function authFetch<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    let { accessToken } = await tokenStorage.get();

    if (!accessToken) {
      try {
        accessToken = await refreshAccessToken();
      } catch (error) {
        console.error("Auth required: No access token and refresh failed.", error);
        throw new Error("No access token available");
      }
    }

    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
      ...options,
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json", // todo
        "X-Tenant": "first", // todo
        ...(options.headers || {}),
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      accessToken = await refreshAccessToken();
      res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
        ...options,
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      });
    }

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  };
}
