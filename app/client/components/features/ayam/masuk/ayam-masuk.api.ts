import { apiClient } from "@/lib/api-client";
import type { AyamMasuk } from "./ayam-masuk.types";

export type CreateAyamMasukInput = {
  kandangId: string;
  tanggal: string;
  jumlahAyam: number;
};

export type UpdateAyamMasukInput = Partial<CreateAyamMasukInput>;

export async function fetchAyamMasukList(): Promise<AyamMasuk[]> {
  const response = await apiClient<AyamMasuk[]>("/api/ayam/masuk");
  return response.data;
}

export async function createAyamMasuk(data: CreateAyamMasukInput): Promise<AyamMasuk> {
  const response = await apiClient<AyamMasuk>("/api/ayam/masuk", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function updateAyamMasuk(id: string, data: UpdateAyamMasukInput): Promise<AyamMasuk> {
  const response = await apiClient<AyamMasuk>(`/api/ayam/masuk/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function deleteAyamMasuk(id: string): Promise<void> {
  await apiClient(`/api/ayam/masuk/${id}`, { method: "DELETE" });
}
