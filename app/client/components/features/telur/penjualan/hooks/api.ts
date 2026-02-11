import { apiClient } from "@/lib/api-client";
import type { PenjualanTelur, CreatePenjualanInput, UpdatePenjualanInput } from "../types";

export async function fetchPenjualanList(kandangId?: string | null, bulan?: string | null) {
  const params = new URLSearchParams();
  if (kandangId) params.set("kandangId", kandangId);
  if (bulan) params.set("bulan", bulan);
  
  const queryString = params.toString();
  const url = queryString ? `/api/telur/penjualan?${queryString}` : "/api/telur/penjualan";
  
  const response = await apiClient<{ list: PenjualanTelur[], summary: any }>(url);
  return response.data;
}

export async function createPenjualan(data: CreatePenjualanInput): Promise<PenjualanTelur> {
  const response = await apiClient<PenjualanTelur>("/api/telur/penjualan", { method: "POST", body: JSON.stringify(data) });
  return response.data;
}

export async function updatePenjualan(id: string, data: UpdatePenjualanInput): Promise<PenjualanTelur> {
  const response = await apiClient<PenjualanTelur>(`/api/telur/penjualan/${id}`, { method: "PUT", body: JSON.stringify(data) });
  return response.data;
}

export async function deletePenjualan(id: string): Promise<void> {
  await apiClient(`/api/telur/penjualan/${id}`, { method: "DELETE" });
}
