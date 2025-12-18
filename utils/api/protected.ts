// utils/api/protected.ts
export const protectedFetch = async (
  endpoint: string,
  options?: RequestInit
) => {
  const url = `/api/protected?endpoint=${encodeURIComponent(endpoint)}`;

  const res = await fetch(url, {
    credentials: "include",
    ...options
  });

  if (!res.ok) throw new Error("Request failed");

  return res.json();
};
