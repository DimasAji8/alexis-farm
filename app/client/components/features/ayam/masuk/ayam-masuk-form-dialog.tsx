"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { styles } from "@/lib/styles";
import type { AyamMasuk } from "./ayam-masuk.types";
import type { CreateAyamMasukInput, UpdateAyamMasukInput } from "./ayam-masuk.api";
import type { Kandang } from "@/components/features/kandang/kandang.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateAyamMasukInput | UpdateAyamMasukInput) => void;
  isLoading: boolean;
  ayamMasuk?: AyamMasuk | null;
  kandangList?: Kandang[];
};

export function AyamMasukFormDialog({ open, onOpenChange, onSubmit, isLoading, ayamMasuk, kandangList }: Props) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateAyamMasukInput>();

  useEffect(() => {
    if (open) {
      reset(ayamMasuk ? {
        kandangId: ayamMasuk.kandangId,
        tanggal: ayamMasuk.tanggal.split("T")[0],
        jumlahAyam: ayamMasuk.jumlahAyam,
      } : { kandangId: "", tanggal: new Date().toISOString().split("T")[0], jumlahAyam: 0 });
    }
  }, [open, ayamMasuk, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{ayamMasuk ? "Edit Ayam Masuk" : "Tambah Ayam Masuk"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Kandang</Label>
            <Controller
              name="kandangId"
              control={control}
              rules={{ required: "Kandang wajib dipilih" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Pilih kandang" /></SelectTrigger>
                  <SelectContent>
                    {kandangList?.filter(k => k.status === "aktif").map(k => (
                      <SelectItem key={k.id} value={k.id}>{k.kode} - {k.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.kandangId && <p className="text-sm text-red-500">{errors.kandangId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Tanggal</Label>
            <Input type="date" {...register("tanggal", { required: "Tanggal wajib diisi" })} />
            {errors.tanggal && <p className="text-sm text-red-500">{errors.tanggal.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Jumlah Ayam</Label>
            <Input type="number" min={1} {...register("jumlahAyam", { required: "Jumlah wajib diisi", valueAsNumber: true, min: { value: 1, message: "Minimal 1" } })} />
            {errors.jumlahAyam && <p className="text-sm text-red-500">{errors.jumlahAyam.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className={styles.button.cancel}>Batal</Button>
            <Button type="submit" disabled={isLoading} className={styles.button.primary}>{isLoading ? "Menyimpan..." : "Simpan"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
