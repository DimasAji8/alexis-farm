import { z } from "zod";

export const createPengeluaranOperasionalSchema = z.object({
  kandangId: z.string().min(1, "Kandang wajib dipilih"),
  tanggal: z.coerce.date({ error: "Tanggal wajib diisi" }),
  kategori: z.string().min(1, "Kategori wajib diisi"),
  jumlah: z.number().positive("Jumlah harus lebih dari 0"),
  keterangan: z.string().min(1, "Keterangan wajib diisi"),
  bukti: z.string().optional(),
});

export type CreatePengeluaranOperasionalInput = z.infer<typeof createPengeluaranOperasionalSchema>;

export const updatePengeluaranOperasionalSchema = createPengeluaranOperasionalSchema.partial();

export type UpdatePengeluaranOperasionalInput = z.infer<typeof updatePengeluaranOperasionalSchema>;
