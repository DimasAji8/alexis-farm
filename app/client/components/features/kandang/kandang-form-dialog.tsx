"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Kandang } from "./kandang.types";

const kandangSchema = z.object({
  kode: z
    .string()
    .min(1, "Kode wajib diisi")
    .max(10, "Maksimal 10 karakter")
    .regex(/^[A-Z0-9]+$/, "Hanya huruf kapital dan angka"),
  nama: z.string().min(1, "Nama wajib diisi").max(50, "Maksimal 50 karakter"),
  lokasi: z.string().optional(),
  status: z.enum(["aktif", "tidak_aktif", "maintenance"]),
  keterangan: z.string().optional(),
});

type KandangFormData = z.infer<typeof kandangSchema>;

interface KandangFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: KandangFormData) => void;
  isLoading?: boolean;
  kandang?: Kandang | null;
}

export function KandangFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  kandang,
}: KandangFormDialogProps) {
  const isEdit = !!kandang;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<KandangFormData>({
    resolver: zodResolver(kandangSchema),
    defaultValues: {
      kode: "",
      nama: "",
      lokasi: "",
      status: "aktif",
      keterangan: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (kandang) {
        reset({
          kode: kandang.kode,
          nama: kandang.nama,
          lokasi: kandang.lokasi || "",
          status: kandang.status as "aktif" | "tidak_aktif" | "maintenance",
          keterangan: kandang.keterangan || "",
        });
      } else {
        reset({
          kode: "",
          nama: "",
          lokasi: "",
          status: "aktif",
          keterangan: "",
        });
      }
    }
  }, [kandang, reset, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Kandang" : "Tambah Kandang Baru"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Ubah informasi kandang di bawah ini."
              : "Isi informasi kandang baru di bawah ini."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid gap-4">
            {/* Kode */}
            <div className="grid gap-2">
              <Label htmlFor="kode">
                Kode <span className="text-red-500">*</span>
              </Label>
              <Input
                id="kode"
                placeholder="Contoh: KDG1"
                disabled={isEdit}
                className={errors.kode ? "border-red-500 focus-visible:ring-red-500" : ""}
                {...register("kode")}
              />
              {errors.kode && (
                <p className="text-xs text-red-500">{errors.kode.message}</p>
              )}
            </div>

            {/* Nama */}
            <div className="grid gap-2">
              <Label htmlFor="nama">
                Nama <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama"
                placeholder="Nama kandang"
                className={errors.nama ? "border-red-500 focus-visible:ring-red-500" : ""}
                {...register("nama")}
              />
              {errors.nama && (
                <p className="text-xs text-red-500">{errors.nama.message}</p>
              )}
            </div>

            {/* Lokasi */}
            <div className="grid gap-2">
              <Label htmlFor="lokasi">Lokasi</Label>
              <Input
                id="lokasi"
                placeholder="Lokasi kandang (opsional)"
                {...register("lokasi")}
              />
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aktif">Aktif</SelectItem>
                      <SelectItem value="tidak_aktif">Tidak Aktif</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Keterangan */}
            <div className="grid gap-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Textarea
                id="keterangan"
                placeholder="Keterangan tambahan (opsional)"
                className="resize-none"
                rows={3}
                {...register("keterangan")}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Kandang"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
