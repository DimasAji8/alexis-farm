import { z } from "zod";

export const createAyamMasukSchema = z.object({
  kandangId: z.string().min(1, "Kandang wajib diisi"),
  tanggal: z.coerce.date({ required_error: "Tanggal wajib diisi" }),
  jumlahAyam: z.number().int().positive("Jumlah ayam harus lebih dari 0"),
});

export type CreateAyamMasukInput = z.infer<typeof createAyamMasukSchema>;
