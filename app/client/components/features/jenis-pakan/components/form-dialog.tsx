"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApiList } from "@/hooks/use-api";
import type { JenisPakan } from "../types";

const schema = z.object({
  kandangId: z.string().min(1, "Kandang wajib dipilih"),
  kode: z.string().min(1, "Kode wajib diisi").max(20, "Maksimal 20 karakter").regex(/^[A-Z0-9]+$/, "Hanya huruf kapital dan angka"),
  nama: z.string().min(1, "Nama wajib diisi").max(100, "Maksimal 100 karakter"),
  satuan: z.string(),
  keterangan: z.string().optional(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
  data?: JenisPakan | null;
}

type Kandang = {
  id: string;
  kode: string;
  nama: string;
};

export function JenisPakanFormDialog({ open, onOpenChange, onSubmit, isLoading, data }: Props) {
  const isEdit = !!data;
  const { data: kandangList = [] } = useApiList<Kandang>("/api/kandang?status=aktif");
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { kandangId: "", kode: "", nama: "", satuan: "KG", keterangan: "", isActive: true },
  });

  useEffect(() => {
    if (open) {
      reset(data ? { 
        kandangId: data.kandangId,
        kode: data.kode, 
        nama: data.nama, 
        satuan: data.satuan, 
        keterangan: data.keterangan || "", 
        isActive: data.isActive 
      } : { 
        kandangId: "", 
        kode: "", 
        nama: "", 
        satuan: "KG", 
        keterangan: "", 
        isActive: true 
      });
    }
  }, [data, reset, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Jenis Pakan" : "Tambah Jenis Pakan"}</DialogTitle>
          <DialogDescription>{isEdit ? "Ubah informasi jenis pakan." : "Isi informasi jenis pakan baru."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="kandang">Kandang <span className="text-red-500">*</span></Label>
              <Controller control={control} name="kandangId" render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={isEdit}>
                  <SelectTrigger className={errors.kandangId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Pilih kandang..." />
                  </SelectTrigger>
                  <SelectContent>
                    {kandangList.map((k) => (
                      <SelectItem key={k.id} value={k.id}>{k.kode} - {k.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} />
              {errors.kandangId && <p className="text-xs text-red-500">{errors.kandangId.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="kode">Kode <span className="text-red-500">*</span></Label>
              <Input id="kode" placeholder="Contoh: PKN1" disabled={isEdit} className={errors.kode ? "border-red-500" : ""} {...register("kode")} />
              {errors.kode && <p className="text-xs text-red-500">{errors.kode.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nama">Nama <span className="text-red-500">*</span></Label>
              <Input id="nama" placeholder="Contoh: Pakan Layer" className={errors.nama ? "border-red-500" : ""} {...register("nama")} />
              {errors.nama && <p className="text-xs text-red-500">{errors.nama.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="satuan">Satuan</Label>
              <Input id="satuan" value="KG" disabled className="bg-muted" {...register("satuan")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Textarea id="keterangan" placeholder="Keterangan (opsional)" className="resize-none" rows={3} {...register("keterangan")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="isActive">Status</Label>
              <Controller control={control} name="isActive" render={({ field }) => (
                <Select onValueChange={(v) => field.onChange(v === "true")} value={field.value ? "true" : "false"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Batal</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Menyimpan..." : isEdit ? "Simpan" : "Tambah"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
