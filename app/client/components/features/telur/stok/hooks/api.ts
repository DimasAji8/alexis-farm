import { apiClient } from "@/lib/api-client";
import type { StokTelur, StokTelurResponse } from "../types";

export async function fetchStokTelurList(kandangId?: string | null, bulan?: string | null): Promise<StokTelurResponse> {
  const params = new URLSearchParams();
  if (kandangId) params.append("kandangId", kandangId);
  if (bulan) params.append("bulan", bulan);
  
  const queryString = params.toString();
  const response = await apiClient<StokTelurResponse>(`/api/telur/stock${queryString ? `?${queryString}` : ""}`);
  return response.data;
}
