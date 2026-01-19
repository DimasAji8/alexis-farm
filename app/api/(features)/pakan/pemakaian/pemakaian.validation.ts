import { z } from "zod";

export const createPemakaianPakanSchema = z.object({
  kandangId: z.string().min(1, "Kandang wajib diisi"),
  jenisPakanId: z.string().min(1, "Jenis pakan wajib diisi"),
  tanggalPakai: z.coerce.date({ error: "Tanggal pakai wajib diisi" }),
  jumlahKg: z.number().positive("Jumlah (kg) harus lebih dari 0"),
  keterangan: z.string().optional(),
});

export type CreatePemakaianPakanInput = z.infer<typeof createPemakaianPakanSchema>;

export const updatePemakaianPakanSchema = createPemakaianPakanSchema.partial();

export type UpdatePemakaianPakanInput = z.infer<typeof updatePemakaianPakanSchema>;
