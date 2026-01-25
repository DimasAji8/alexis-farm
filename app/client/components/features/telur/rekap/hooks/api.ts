import { apiClient } from "@/lib/api-client";
import type { RekapTelurHarian } from "../types";

export async function fetchRekapHarian(kandangId: string, bulan: string): Promise<RekapTelurHarian[]> {
  const response = await apiClient<RekapTelurHarian[]>(`/api/telur/rekap?kandangId=${kandangId}&bulan=${bulan}`);
  return response.data;
}
