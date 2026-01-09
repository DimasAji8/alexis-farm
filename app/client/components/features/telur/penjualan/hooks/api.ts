import { apiClient } from "@/lib/api-client";
import type { PenjualanTelur, CreatePenjualanInput, UpdatePenjualanInput } from "../types";

export async function fetchPenjualanList(): Promise<PenjualanTelur[]> {
  const response = await apiClient<PenjualanTelur[]>("/api/telur/penjualan");
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
