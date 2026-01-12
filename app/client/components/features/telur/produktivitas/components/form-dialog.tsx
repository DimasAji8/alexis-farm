"use client";

import { useMemo } from "react";
import { FormDialog, type FieldConfig } from "@/components/shared/form-dialog";
import type { ProduktivitasTelur, CreateProduktivitasInput } from "../types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<CreateProduktivitasInput, "kandangId">) => void;
  isLoading: boolean;
  data?: ProduktivitasTelur | null;
};

type FormData = Omit<CreateProduktivitasInput, "kandangId">;

export function ProduktivitasFormDialog({ open, onOpenChange, onSubmit, isLoading, data }: Props) {
  const fields: FieldConfig<FormData>[] = useMemo(() => [
    { name: "tanggal", label: "Tanggal", type: "date", required: true },
    { name: "jumlahBagusButir", label: "Telur Bagus (butir)", type: "number", placeholder: "Contoh: 150", required: true, min: 0 },
    { name: "jumlahTidakBagusButir", label: "Telur Tidak Bagus", type: "number", placeholder: "Contoh: 10", min: 0 },
    { name: "totalKg", label: "Total Berat (kg)", type: "number", placeholder: "Contoh: 9.5", min: 0, step: 0.01 },
    { name: "keterangan", label: "Keterangan", type: "textarea", placeholder: "Keterangan (opsional)", colSpan: 2 },
  ], []);

  const editData = data ? {
    tanggal: data.tanggal.split("T")[0],
    jumlahBagusButir: data.jumlahBagusButir,
    jumlahTidakBagusButir: data.jumlahTidakBagusButir,
    totalKg: data.totalKg,
    keterangan: data.keterangan || "",
  } : null;

  return (
    <FormDialog<FormData>
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isLoading={isLoading}
      title="Produktivitas Telur"
      fields={fields}
      defaultValues={{ tanggal: new Date().toISOString().split("T")[0], jumlahBagusButir: "" as unknown as number, jumlahTidakBagusButir: "" as unknown as number, totalKg: "" as unknown as number, keterangan: "" }}
      editData={editData}
      columns={2}
    />
  );
}
