"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useJenisPakanList } from "@/components/features/jenis-pakan/hooks/use-jenis-pakan";
import { cn } from "@/lib/utils";

const formatCurrency = (value: string) => {
  const num = value.replace(/\D/g, "");
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseCurrency = (value: string) => Number(value.replace(/\./g, "")) || 0;

const schema = z.object({
  jenisPakanId: z.string().min(1, "Jenis pakan wajib dipilih"),
  tanggalBeli: z.date({ required_error: "Tanggal wajib diisi" }),
  jumlahKg: z.coerce.number().positive("Jumlah harus lebih dari 0"),
  hargaPerKg: z.coerce.number().positive("Harga harus lebih dari 0"),
  keterangan: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export function PembelianPakanFormDialog({ open, onOpenChange, onSubmit, isLoading }: Props) {
  const { data: jenisPakan } = useJenisPakanList();
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { jenisPakanId: "", tanggalBeli: new Date(), jumlahKg: undefined, hargaPerKg: undefined, keterangan: "" },
  });

  useEffect(() => {
    if (open) reset({ jenisPakanId: "", tanggalBeli: new Date(), jumlahKg: undefined, hargaPerKg: undefined, keterangan: "" });
  }, [reset, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Pembelian Pakan</DialogTitle>
          <DialogDescription>Isi informasi pembelian pakan baru.</DialogDescription>
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
              <Controller control={control} name="tanggalBeli" render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={cn(
                        "justify-start text-left font-normal w-full",
                        !field.value && "text-muted-foreground",
                        errors.tanggalBeli && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
              )} />
              {errors.tanggalBeli && <p className="text-xs text-red-500">{errors.tanggalBeli.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jumlahKg">Jumlah (Kg) <span className="text-red-500">*</span></Label>
              <Input id="jumlahKg" type="number" step="0.01" placeholder="Contoh: 50" className={errors.jumlahKg ? "border-red-500" : ""} {...register("jumlahKg")} />
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
