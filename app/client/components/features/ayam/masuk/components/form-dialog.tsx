"use client";

import { useMemo } from "react";
import { FormDialog, type FieldConfig } from "@/components/shared/form-dialog";
import { getLocalDateString } from "@/lib/date-utils";
import type { AyamMasuk, CreateAyamMasukInput } from "../types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<CreateAyamMasukInput, "kandangId">) => void;
  isLoading: boolean;
  data?: AyamMasuk | null;
};

type FormData = Omit<CreateAyamMasukInput, "kandangId">;

export function AyamMasukFormDialog({ open, onOpenChange, onSubmit, isLoading, data }: Props) {
  const fields: FieldConfig<FormData>[] = useMemo(() => [
    { name: "tanggal", label: "Tanggal", type: "date", required: true },
    { name: "jumlahAyam", label: "Jumlah Ayam", type: "number", placeholder: "Contoh: 100", required: true, min: 1 },
  ], []);

  const editData = data ? { tanggal: data.tanggal, jumlahAyam: data.jumlahAyam } : null;

  return (
    <FormDialog<FormData>
      open={open} onOpenChange={onOpenChange} onSubmit={onSubmit} isLoading={isLoading}
      title="Ayam Masuk" fields={fields}
      defaultValues={{ tanggal: getLocalDateString(), jumlahAyam: undefined as unknown as number }}
      editData={editData}
    />
  );
}
