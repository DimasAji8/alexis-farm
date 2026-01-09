"use client";

import { useMemo } from "react";
import { FormDialog, type FieldConfig } from "@/components/shared/form-dialog";
import type { AyamMasuk, CreateAyamMasukInput } from "../types";
import type { Kandang } from "@/components/features/kandang/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateAyamMasukInput) => void;
  isLoading: boolean;
  data?: AyamMasuk | null;
  kandangList?: Kandang[];
};

export function AyamMasukFormDialog({ open, onOpenChange, onSubmit, isLoading, data, kandangList }: Props) {
  const fields: FieldConfig<CreateAyamMasukInput>[] = useMemo(() => [
    { name: "kandangId", label: "Kandang", type: "select", placeholder: "Pilih kandang", required: true, options: kandangList?.filter(k => k.status === "aktif").map(k => ({ value: k.id, label: `${k.kode} - ${k.nama}` })) || [] },
    { name: "tanggal", label: "Tanggal", type: "date", required: true },
    { name: "jumlahAyam", label: "Jumlah Ayam", type: "number", required: true, min: 1 },
  ], [kandangList]);

  const editData = data ? { kandangId: data.kandangId, tanggal: data.tanggal.split("T")[0], jumlahAyam: data.jumlahAyam } : null;

  return (
    <FormDialog<CreateAyamMasukInput>
      open={open} onOpenChange={onOpenChange} onSubmit={onSubmit} isLoading={isLoading}
      title="Ayam Masuk" fields={fields}
      defaultValues={{ kandangId: "", tanggal: new Date().toISOString().split("T")[0], jumlahAyam: 0 }}
      editData={editData}
    />
  );
}
