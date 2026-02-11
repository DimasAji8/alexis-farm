"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { getLocalDateString } from "@/lib/date-utils";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

const KATEGORI_OPTIONS = [
  "Modal Awal",
  "Pinjaman",
  "Hibah",
  "Lainnya",
];

type FormData = {
  tanggal: string;
  items: Array<{
    kategori: string;
    jumlah: string;
    keterangan: string;
  }>;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any[]) => void;
  isLoading: boolean;
  data?: any | null;
}

const formatCurrency = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseCurrency = (value: string) => {
  return value.replace(/\./g, "");
};

export function PemasukanFormDialog({ open, onOpenChange, onSubmit, isLoading, data }: Props) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      tanggal: getLocalDateString(),
      items: [{ kategori: "Modal Awal", jumlah: "", keterangan: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    if (open && !data) {
      reset({
        tanggal: getLocalDateString(),
        items: [{ kategori: "Modal Awal", jumlah: "", keterangan: "" }],
      });
    } else if (data) {
      const tanggalStr = getLocalDateString(new Date(data.tanggal));
      reset({
        tanggal: tanggalStr,
        items: [{ kategori: data.kategori, jumlah: data.jumlah.toString(), keterangan: data.keterangan }],
      });
    }
  }, [open, data, reset]);

  const handleFormSubmit = (formData: FormData) => {
    if (!formData.tanggal) {
      toast.error("Tanggal wajib diisi");
      return;
    }

    const items = formData.items.map((item) => {
      const jumlah = parseFloat(parseCurrency(item.jumlah));
      if (!jumlah || jumlah <= 0) {
        throw new Error("Jumlah harus lebih dari 0");
      }
      if (!item.keterangan?.trim()) {
        throw new Error("Keterangan wajib diisi");
      }
      return {
        tanggal: new Date(formData.tanggal),
        kategori: item.kategori,
        jumlah,
        keterangan: item.keterangan.trim(),
      };
    });

    onSubmit(items);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{data ? "Edit" : "Tambah"} Pemasukan</DialogTitle>
          <DialogDescription>
            {data ? "Ubah data pemasukan" : "Tambahkan data pemasukan baru"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 space-y-4">
            <div>
              <Label htmlFor="tanggal">Tanggal</Label>
              <Controller
                control={control}
                name="tanggal"
                rules={{ required: true }}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.tanggal}
                  />
                )}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Item Pemasukan</Label>
                {!data && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ kategori: "Modal Awal", jumlah: "", keterangan: "" })}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Tambah Item
                  </Button>
                )}
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-3 relative">
                  {!data && fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}

                  <div>
                    <Label htmlFor={`items.${index}.kategori`}>Kategori</Label>
                    <Controller
                      control={control}
                      name={`items.${index}.kategori`}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
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
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`items.${index}.keterangan`}>
                      Keterangan <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      placeholder="Detail pemasukan..."
                      rows={2}
                      {...register(`items.${index}.keterangan`, { required: true })}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`items.${index}.jumlah`}>Jumlah (Rp)</Label>
                    <Controller
                      control={control}
                      name={`items.${index}.jumlah`}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="Masukkan jumlah"
                          value={field.value ? formatCurrency(field.value) : ""}
                          onChange={(e) => field.onChange(parseCurrency(e.target.value))}
                        />
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end px-6 py-4 border-t bg-muted/30">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : data ? "Simpan" : `Simpan ${fields.length} Item`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}