"use client";

import { useMemo } from "react";
import { FormDialog, type FieldConfig } from "@/components/shared/form-dialog";
import type { PenjualanTelur, CreatePenjualanInput } from "../types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreatePenjualanInput) => void;
  isLoading: boolean;
  penjualan?: PenjualanTelur | null;
  stokTersedia?: number;
};

export function PenjualanFormDialog({ open, onOpenChange, onSubmit, isLoading, penjualan, stokTersedia = 0 }: Props) {
  const isEdit = !!penjualan;
  const maxKg = isEdit ? stokTersedia + penjualan.beratKg : stokTersedia;

  const fields: FieldConfig<CreatePenjualanInput>[] = useMemo(() => [
    { name: "tanggal", label: "Tanggal", type: "date", required: true },
    { name: "pembeli", label: "Pembeli", type: "text", placeholder: "Nama pembeli", required: true },
    { name: "beratKg", label: `Berat (Kg) - Maks: ${maxKg.toLocaleString("id-ID")} kg`, type: "number", required: true, min: 0.1, max: maxKg, step: 0.1 },
    { name: "hargaPerKg", label: "Harga per Kg (Rp)", type: "number", required: true, min: 1 },
    { name: "metodeBayar", label: "Metode Bayar", type: "select", options: [
      { value: "tunai", label: "Tunai" },
      { value: "transfer", label: "Transfer" },
      { value: "tempo", label: "Tempo" },
    ]},
    { name: "deskripsi", label: "Keterangan", type: "textarea", placeholder: "Keterangan (opsional)" },
  ], [maxKg]);

  const editData = penjualan ? {
    tanggal: penjualan.tanggal.split("T")[0],
    pembeli: penjualan.pembeli,
    beratKg: penjualan.beratKg,
    hargaPerKg: penjualan.hargaPerKg,
    metodeBayar: penjualan.metodeBayar || "tunai",
    deskripsi: penjualan.keterangan || "",
  } : null;

  return (
    <FormDialog<CreatePenjualanInput>
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isLoading={isLoading}
      title={isEdit ? "Edit Penjualan" : "Tambah Penjualan"}
      fields={fields}
      defaultValues={{ tanggal: new Date().toISOString().split("T")[0], pembeli: "", beratKg: 0, hargaPerKg: 0, metodeBayar: "tunai", deskripsi: "" }}
      editData={editData}
    />
  );
}
