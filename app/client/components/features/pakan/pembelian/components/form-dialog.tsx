"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useJenisPakanList } from "@/components/features/jenis-pakan/hooks/use-jenis-pakan";
import { getLocalDateString } from "@/lib/date-utils";

const formatCurrency = (value: string) => {
  const num = value.replace(/\D/g, "");
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseCurrency = (value: string) => Number(value.replace(/\./g, "")) || 0;

const schema = z.object({
  jenisPakanId: z.string().min(1, "Jenis pakan wajib dipilih"),
  tanggalBeli: z.string().min(1, "Tanggal wajib diisi"),
  jumlahKg: z.number().positive("Jumlah harus lebih dari 0"),
  hargaPerKg: z.number().positive("Harga harus lebih dari 0"),
  keterangan: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
  editData?: any;
}

export function PembelianPakanFormDialog({ open, onOpenChange, onSubmit, isLoading, editData }: Props) {
  const { data: jenisPakan } = useJenisPakanList(true);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { jenisPakanId: "", tanggalBeli: getLocalDateString(), jumlahKg: undefined, hargaPerKg: undefined, keterangan: "" },
  });

  useEffect(() => {
    if (open) {
      if (editData) {
        reset({
          jenisPakanId: editData.jenisPakanId,
          tanggalBeli: editData.tanggalBeli?.split('T')[0] || getLocalDateString(),
          jumlahKg: editData.jumlahKg,
          hargaPerKg: editData.hargaPerKg,
          keterangan: editData.keterangan || "",
        });
      } else {
        reset({ jenisPakanId: "", tanggalBeli: getLocalDateString(), jumlahKg: undefined, hargaPerKg: undefined, keterangan: "" });
      }
    }
  }, [reset, open, editData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit" : "Tambah"} Pembelian Pakan</DialogTitle>
          <DialogDescription>Isi informasi pembelian pakan {editData ? "yang akan diubah" : "baru"}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="jenisPakanId">Jenis Pakan <span className="text-red-500">*</span></Label>
              <Controller control={control} name="jenisPakanId" render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={errors.jenisPakanId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Pilih jenis pakan" />
                  </SelectTrigger>
                  <SelectContent>
                    {jenisPakan?.map((jp) => (
                      <SelectItem key={jp.id} value={jp.id}>{jp.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} />
              {errors.jenisPakanId && <p className="text-xs text-red-500">{errors.jenisPakanId.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tanggalBeli">Tanggal Beli <span className="text-red-500">*</span></Label>
              <Controller 
                control={control} 
                name="tanggalBeli" 
                render={({ field }) => (
                  <DatePicker 
                    value={field.value} 
                    onChange={field.onChange} 
                    error={!!errors.tanggalBeli} 
                  />
                )} 
              />
              {errors.tanggalBeli && <p className="text-xs text-red-500">{errors.tanggalBeli.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jumlahKg">Jumlah (Kg) <span className="text-red-500">*</span></Label>
              <Input id="jumlahKg" type="number" step="0.01" placeholder="Contoh: 50" className={errors.jumlahKg ? "border-red-500" : ""} {...register("jumlahKg", { valueAsNumber: true })} />
              {errors.jumlahKg && <p className="text-xs text-red-500">{errors.jumlahKg.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hargaPerKg">Harga per Kg <span className="text-red-500">*</span></Label>
              <Controller
                name="hargaPerKg"
                control={control}
                render={({ field }) => (
                  <Input
                    id="hargaPerKg"
                    type="text"
                    inputMode="numeric"
                    placeholder="Contoh: 15.000"
                    className={errors.hargaPerKg ? "border-red-500" : ""}
                    value={field.value ? formatCurrency(String(field.value)) : ""}
                    onChange={(e) => field.onChange(parseCurrency(e.target.value))}
                  />
                )}
              />
              {errors.hargaPerKg && <p className="text-xs text-red-500">{errors.hargaPerKg.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Input id="keterangan" placeholder="Keterangan (opsional)" {...register("keterangan")} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Batal</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Menyimpan..." : "Simpan"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
