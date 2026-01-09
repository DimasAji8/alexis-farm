import { apiClient } from "@/lib/api-client";
import type { StokTelur } from "../types";

export async function fetchStokTelurList(): Promise<StokTelur[]> {
  const response = await apiClient<StokTelur[]>("/api/telur/stock");
  return response.data;
}
