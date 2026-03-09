"use client";

import { useMemo } from "react";
import { FormDialog, type FieldConfig } from "@/components/shared/form-dialog";
import { getLocalDateString } from "@/lib/date-utils";
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

  const fields: FieldConfig<FormData>[] = useMemo(() => {
    const baseFields: FieldConfig<FormData>[] = [
      { name: "tanggal", label: "Tanggal", type: "date", required: true },
      { name: "pembeli", label: "Pembeli", type: "text", placeholder: "Nama pembeli", required: true },
      { name: "beratKg", label: `Berat (Kg)`, type: "number", placeholder: "Contoh: 10.5", required: true, min: 0.1, step: 0.1 },
      { name: "hargaPerKg", label: "Harga per Kg (Rp)", type: "currency", placeholder: "Contoh: 25.000", required: true, min: 1 },
    ];

    // Hanya tampilkan status bayar dan tanggal bayar saat edit
    if (isEdit) {
      baseFields.push(
        { name: "statusBayar", label: "Status Bayar", type: "select", required: true, options: [
          { value: "dibayar", label: "Sudah Dibayar" },
          { value: "belum_dibayar", label: "Belum Dibayar" },
        ]},
        { name: "tanggalBayar", label: "Tanggal Bayar", type: "date", required: false }
      );
    }

    baseFields.push(
      { name: "deskripsi", label: "Keterangan", type: "textarea", placeholder: "Keterangan (opsional)" }
    );

    return baseFields;
  }, [isEdit]);

  const editData = penjualan ? {
    tanggal: penjualan.tanggal,
    pembeli: penjualan.pembeli,
    beratKg: penjualan.beratKg,
    hargaPerKg: penjualan.hargaPerKg,
    statusBayar: (penjualan.statusBayar || "dibayar") as "dibayar" | "belum_dibayar",
    tanggalBayar: penjualan.tanggalBayar || penjualan.tanggal,
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
      defaultValues={{ tanggal: getLocalDateString(), pembeli: "", beratKg: undefined as unknown as number, hargaPerKg: undefined as unknown as number, deskripsi: "" }}
      editData={editData}
    />
  );
}
