import { apiClient } from "@/lib/api-client";
import type { PembelianPakan, CreatePembelianPakanInput, UpdatePembelianPakanInput } from "../types";

export const fetchPembelianPakanList = () => 
  apiClient<PembelianPakan[]>("/api/pakan/pembelian").then(res => res.data);

export const createPembelianPakan = (data: CreatePembelianPakanInput) => 
  apiClient<PembelianPakan>("/api/pakan/pembelian", {
    method: "POST",
    body: JSON.stringify(data),
  }).then(res => res.data);

export const updatePembelianPakan = (id: string, data: UpdatePembelianPakanInput) => 
  apiClient<PembelianPakan>(`/api/pakan/pembelian/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }).then(res => res.data);

export const deletePembelianPakan = (id: string) => 
  apiClient(`/api/pakan/pembelian/${id}`, {
    method: "DELETE",
  }).then(res => res.data);
