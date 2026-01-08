"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { styles } from "@/lib/styles";
import type { KematianAyam } from "./kematian.types";
import type { CreateKematianInput, UpdateKematianInput } from "./kematian.api";
import type { Kandang } from "@/components/features/kandang/kandang.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateKematianInput | UpdateKematianInput) => void;
  isLoading: boolean;
  kematian?: KematianAyam | null;
  kandangList?: Kandang[];
};

export function KematianFormDialog({ open, onOpenChange, onSubmit, isLoading, kematian, kandangList }: Props) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateKematianInput>();

  useEffect(() => {
    if (open) {
      reset(kematian ? {
        kandangId: kematian.kandangId,
        tanggal: kematian.tanggal.split("T")[0],
        jumlahMati: kematian.jumlahMati,
        keterangan: kematian.keterangan || "",
      } : { kandangId: "", tanggal: new Date().toISOString().split("T")[0], jumlahMati: 0, keterangan: "" });
    }
  }, [open, kematian, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{kematian ? "Edit Kematian" : "Tambah Kematian"}</DialogTitle>
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
                      <SelectItem key={k.id} value={k.id}>{k.kode} - {k.nama} ({k.jumlahAyam} ekor)</SelectItem>
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
            <Label>Jumlah Mati</Label>
            <Input type="number" min={1} {...register("jumlahMati", { required: "Jumlah wajib diisi", valueAsNumber: true, min: { value: 1, message: "Minimal 1" } })} />
            {errors.jumlahMati && <p className="text-sm text-red-500">{errors.jumlahMati.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Keterangan</Label>
            <Textarea {...register("keterangan")} placeholder="Penyebab kematian (opsional)" />
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
