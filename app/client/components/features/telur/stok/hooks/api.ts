import { apiClient } from "@/lib/api-client";
import type { StokTelur } from "../types";

export async function fetchStokTelurList(kandangId?: string | null): Promise<StokTelur[]> {
  const params = kandangId ? `?kandangId=${kandangId}` : "";
  const response = await apiClient<StokTelur[]>(`/api/telur/stock${params}`);
  return response.data;
}
