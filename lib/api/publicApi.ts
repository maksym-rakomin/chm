export async function publicFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json", // todo
      "X-Tenant": "first", // todo
      ...(options.headers || {}),
    },
    cache: "no-store",
  });


  if (!res.ok) {
    const parseRes = await res.json()
    throw new Error(`API error: ${parseRes.message}`);
  }
  return res.json();
}
