export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function apiClient<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(input, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !payload?.success) {
    const message =
      payload?.message ??
      `Request gagal (${response.status} ${response.statusText})`;
    throw new Error(message);
  }

  return payload;
}
