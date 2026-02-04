import { z } from "zod";

export const createPemasukanSchema = z.object({
  tanggal: z.coerce.date(),
  kategori: z.string().min(1, "Kategori wajib diisi"),
  jumlah: z.number().positive("Jumlah harus lebih dari 0"),
  keterangan: z.string().min(1, "Keterangan wajib diisi"),
});

export const updatePemasukanSchema = createPemasukanSchema.partial();

export type CreatePemasukanInput = z.infer<typeof createPemasukanSchema>;
export type UpdatePemasukanInput = z.infer<typeof updatePemasukanSchema>;
