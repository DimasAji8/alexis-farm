"use client";

import { useMemo } from "react";
import { FormDialog, type FieldConfig } from "@/components/shared/form-dialog";
import type { KematianAyam, CreateKematianInput } from "../types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<CreateKematianInput, "kandangId">) => void;
  isLoading: boolean;
  kematian?: KematianAyam | null;
};

type FormData = Omit<CreateKematianInput, "kandangId">;

export function KematianFormDialog({ open, onOpenChange, onSubmit, isLoading, kematian }: Props) {
  const fields: FieldConfig<FormData>[] = useMemo(() => [
    { name: "tanggal", label: "Tanggal", type: "date", required: true },
    { name: "jumlahMati", label: "Jumlah Mati", type: "number", placeholder: "Contoh: 5", required: true, min: 1 },
    { name: "keterangan", label: "Keterangan", type: "textarea", placeholder: "Penyebab kematian (opsional)" },
  ], []);

  const editData = kematian ? {
    tanggal: kematian.tanggal,
    jumlahMati: kematian.jumlahMati,
    keterangan: kematian.keterangan || "",
  } : null;

  return (
    <FormDialog<FormData>
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isLoading={isLoading}
      title="Kematian Ayam"
      fields={fields}
      defaultValues={{ tanggal: new Date().toISOString().split('T')[0], jumlahMati: undefined as unknown as number, keterangan: "" }}
      editData={editData}
    />
  );
}
