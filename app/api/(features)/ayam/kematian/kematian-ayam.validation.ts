import { z } from "zod";

export const createKematianAyamSchema = z.object({
  kandangId: z.string().min(1, "Kandang wajib diisi"),
  tanggal: z.coerce.date({ required_error: "Tanggal wajib diisi" }),
  jumlahMati: z.number().int().positive("Jumlah mati harus lebih dari 0"),
  keterangan: z.string().optional(),
});

export type CreateKematianAyamInput = z.infer<typeof createKematianAyamSchema>;
