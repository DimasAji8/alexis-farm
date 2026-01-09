"use client";

import { useMemo } from "react";
import { FormDialog, type FieldConfig } from "@/components/shared/form-dialog";
import type { KematianAyam, CreateKematianInput } from "../types";
import type { Kandang } from "@/components/features/kandang/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateKematianInput) => void;
  isLoading: boolean;
  kematian?: KematianAyam | null;
  kandangList?: Kandang[];
};

export function KematianFormDialog({ open, onOpenChange, onSubmit, isLoading, kematian, kandangList }: Props) {
  const fields: FieldConfig<CreateKematianInput>[] = useMemo(() => [
    {
      name: "kandangId",
      label: "Kandang",
      type: "select",
      placeholder: "Pilih kandang",
      required: true,
      options: kandangList?.filter(k => k.status === "aktif").map(k => ({ value: k.id, label: `${k.kode} - ${k.nama} (${k.jumlahAyam} ekor)` })) || [],
    },
    { name: "tanggal", label: "Tanggal", type: "date", required: true },
    { name: "jumlahMati", label: "Jumlah Mati", type: "number", required: true, min: 1 },
    { name: "keterangan", label: "Keterangan", type: "textarea", placeholder: "Penyebab kematian (opsional)" },
  ], [kandangList]);

  const editData = kematian ? {
    kandangId: kematian.kandangId,
    tanggal: kematian.tanggal.split("T")[0],
    jumlahMati: kematian.jumlahMati,
    keterangan: kematian.keterangan || "",
  } : null;

  return (
    <FormDialog<CreateKematianInput>
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isLoading={isLoading}
      title="Kematian Ayam"
      fields={fields}
      defaultValues={{ kandangId: "", tanggal: new Date().toISOString().split("T")[0], jumlahMati: 0, keterangan: "" }}
      editData={editData}
    />
  );
}
