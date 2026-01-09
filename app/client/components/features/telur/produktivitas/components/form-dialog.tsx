"use client";

import { useMemo } from "react";
import { FormDialog, type FieldConfig } from "@/components/shared/form-dialog";
import type { ProduktivitasTelur, CreateProduktivitasInput } from "../types";
import type { Kandang } from "@/components/features/kandang/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateProduktivitasInput) => void;
  isLoading: boolean;
  data?: ProduktivitasTelur | null;
  kandangList?: Kandang[];
};

export function ProduktivitasFormDialog({ open, onOpenChange, onSubmit, isLoading, data, kandangList }: Props) {
  const fields: FieldConfig<CreateProduktivitasInput>[] = useMemo(() => [
    {
      name: "kandangId",
      label: "Kandang",
      type: "select",
      placeholder: "Pilih kandang",
      required: true,
      options: kandangList?.filter(k => k.status === "aktif").map(k => ({ value: k.id, label: `${k.kode} - ${k.nama}` })) || [],
    },
    { name: "tanggal", label: "Tanggal", type: "date", required: true },
    { name: "jumlahBagusButir", label: "Telur Bagus (butir)", type: "number", required: true, min: 0 },
    { name: "jumlahTidakBagusButir", label: "Telur Tidak Bagus", type: "number", min: 0 },
    { name: "totalKg", label: "Total Berat (kg)", type: "number", min: 0, step: 0.01 },
    { name: "keterangan", label: "Keterangan", type: "textarea", placeholder: "Keterangan (opsional)", colSpan: 2 },
  ], [kandangList]);

  const editData = data ? {
    kandangId: data.kandangId,
    tanggal: data.tanggal.split("T")[0],
    jumlahBagusButir: data.jumlahBagusButir,
    jumlahTidakBagusButir: data.jumlahTidakBagusButir,
    totalKg: data.totalKg,
    keterangan: data.keterangan || "",
  } : null;

  return (
    <FormDialog<CreateProduktivitasInput>
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isLoading={isLoading}
      title="Produktivitas Telur"
      fields={fields}
      defaultValues={{ kandangId: "", tanggal: new Date().toISOString().split("T")[0], jumlahBagusButir: "" as unknown as number, jumlahTidakBagusButir: "" as unknown as number, totalKg: "" as unknown as number, keterangan: "" }}
      editData={editData}
      columns={2}
    />
  );
}
