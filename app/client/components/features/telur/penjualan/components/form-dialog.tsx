"use client";

import { useMemo } from "react";
import { FormDialog, type FieldConfig } from "@/components/shared/form-dialog";
import type { PenjualanTelur, CreatePenjualanInput } from "../types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<CreatePenjualanInput, "kandangId">) => void;
  isLoading: boolean;
  penjualan?: PenjualanTelur | null;
  stokTersedia?: number;
};

type FormData = Omit<CreatePenjualanInput, "kandangId">;

export function PenjualanFormDialog({ open, onOpenChange, onSubmit, isLoading, penjualan, stokTersedia = 0 }: Props) {
  const isEdit = !!penjualan;

  const fields: FieldConfig<FormData>[] = useMemo(() => [
    { name: "tanggal", label: "Tanggal", type: "date", required: true },
    { name: "pembeli", label: "Pembeli", type: "text", placeholder: "Nama pembeli", required: true },
    { name: "beratKg", label: `Berat (Kg)`, type: "number", placeholder: "Contoh: 10.5", required: true, min: 0.1, step: 0.1 },
    { name: "hargaPerKg", label: "Harga per Kg (Rp)", type: "currency", placeholder: "Contoh: 25.000", required: true, min: 1 },
    { name: "metodeBayar", label: "Metode Bayar", type: "select", options: [
      { value: "tunai", label: "Tunai" },
      { value: "transfer", label: "Transfer" },
      { value: "tempo", label: "Tempo" },
    ]},
    { name: "deskripsi", label: "Keterangan", type: "textarea", placeholder: "Keterangan (opsional)" },
  ], []);

  const editData = penjualan ? {
    tanggal: penjualan.tanggal.split("T")[0],
    pembeli: penjualan.pembeli,
    beratKg: penjualan.beratKg,
    hargaPerKg: penjualan.hargaPerKg,
    metodeBayar: penjualan.metodeBayar || "tunai",
    deskripsi: penjualan.keterangan || "",
  } : null;

  return (
    <FormDialog<FormData>
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isLoading={isLoading}
      title={isEdit ? "Edit Penjualan" : "Tambah Penjualan"}
      fields={fields}
      defaultValues={{ tanggal: new Date().toISOString().split("T")[0], pembeli: "", beratKg: undefined as unknown as number, hargaPerKg: undefined as unknown as number, metodeBayar: "tunai", deskripsi: "" }}
      editData={editData}
    />
  );
}
