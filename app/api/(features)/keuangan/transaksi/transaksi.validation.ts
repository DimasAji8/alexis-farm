import { z } from "zod";

export const createTransaksiKeuanganSchema = z.object({
  tanggal: z.coerce.date({ required_error: "Tanggal wajib diisi" }),
  jenis: z.enum(["pemasukan", "pengeluaran"], { required_error: "Jenis wajib diisi" }),
  kategori: z.string().min(1, "Kategori wajib diisi"),
  jumlah: z.number().positive("Jumlah harus lebih dari 0"),
  keterangan: z.string().optional(),
  referensiId: z.string().optional(),
  referensiType: z.string().optional(),
});

export type CreateTransaksiKeuanganInput = z.infer<typeof createTransaksiKeuanganSchema>;

export const updateTransaksiKeuanganSchema = createTransaksiKeuanganSchema.partial();

export type UpdateTransaksiKeuanganInput = z.infer<typeof updateTransaksiKeuanganSchema>;
