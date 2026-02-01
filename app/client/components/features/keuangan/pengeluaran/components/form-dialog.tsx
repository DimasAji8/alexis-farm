"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreatePengeluaranInput, PengeluaranOperasional } from "../types";
import { useEffect, useState } from "react";

const KATEGORI_OPTIONS = [
  "Listrik",
  "Air",
  "Gaji",
  "Maintenance",
  "Transport",
  "Lainnya",
];

type FormData = {
  tanggal: string;
  kategori: string;
  jumlah: string;
  keterangan: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<CreatePengeluaranInput, "bukti">) => void;
  isLoading: boolean;
  data?: PengeluaranOperasional | null;
}

const formatCurrency = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseCurrency = (value: string) => {
  return value.replace(/\./g, "");
};

export function PengeluaranFormDialog({ open, onOpenChange, onSubmit, isLoading, data }: Props) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      tanggal: new Date().toISOString().split("T")[0],
      kategori: "Listrik",
      jumlah: "",
      keterangan: "",
    },
  });

  const kategori = watch("kategori");
  const [displayJumlah, setDisplayJumlah] = useState("");

  useEffect(() => {
    if (data) {
      setValue("tanggal", new Date(data.tanggal).toISOString().split("T")[0]);
      setValue("kategori", data.kategori);
      setValue("jumlah", data.jumlah.toString());
      setDisplayJumlah(formatCurrency(data.jumlah.toString()));
      setValue("keterangan", data.keterangan);
    } else {
      reset({
        tanggal: new Date().toISOString().split("T")[0],
        kategori: "Listrik",
        jumlah: "",
        keterangan: "",
      });
      setDisplayJumlah("");
    }
  }, [data, setValue, reset]);

  const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setDisplayJumlah(formatted);
    setValue("jumlah", parseCurrency(formatted));
  };

  const handleFormSubmit = (formData: FormData) => {
    // Validasi manual
    if (!formData.tanggal) {
      toast.error("Tanggal wajib diisi");
      return;
    }
    if (!formData.jumlah || parseFloat(formData.jumlah) <= 0) {
      toast.error("Jumlah harus lebih dari 0");
      return;
    }
    if (!formData.keterangan || !formData.keterangan.trim()) {
      toast.error("Keterangan wajib diisi");
      return;
    }
    
    onSubmit({
      tanggal: new Date(formData.tanggal),
      kategori: formData.kategori,
      jumlah: parseFloat(formData.jumlah),
      keterangan: formData.keterangan.trim(),
    });
  };

  const handleFormError = () => {
    if (errors.tanggal) {
      toast.error("Tanggal wajib diisi");
    } else if (errors.jumlah) {
      toast.error("Jumlah wajib diisi");
    } else if (errors.keterangan) {
      toast.error("Keterangan wajib diisi");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data ? "Edit" : "Tambah"} Pengeluaran Operasional</DialogTitle>
          <DialogDescription>
            {data ? "Ubah data pengeluaran operasional" : "Tambahkan data pengeluaran operasional baru"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit, handleFormError)} className="space-y-4">
          <div>
            <Label htmlFor="tanggal">Tanggal</Label>
            <Input id="tanggal" type="date" {...register("tanggal", { required: true })} />
          </div>

          <div>
            <Label htmlFor="kategori">Kategori</Label>
            <Select value={kategori} onValueChange={(v) => setValue("kategori", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {KATEGORI_OPTIONS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="jumlah">Jumlah (Rp)</Label>
            <Input
              id="jumlah"
              type="text"
              placeholder="0"
              value={displayJumlah}
              onChange={handleJumlahChange}
            />
            <input type="hidden" {...register("jumlah", { required: true, min: 0 })} />
          </div>

          <div>
            <Label htmlFor="keterangan">
              Keterangan <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="keterangan"
              placeholder="Detail pengeluaran..."
              {...register("keterangan", { required: true })}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
