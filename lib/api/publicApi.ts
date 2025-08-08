export async function publicFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
