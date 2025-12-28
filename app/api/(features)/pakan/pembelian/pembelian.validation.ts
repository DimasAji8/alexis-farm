import { z } from "zod";

export const createPembelianPakanSchema = z.object({
  jenisPakanId: z.string().min(1, "Jenis pakan wajib diisi"),
  tanggalBeli: z.coerce.date({ required_error: "Tanggal beli wajib diisi" }),
  jumlahKg: z.number().positive("Jumlah (kg) harus lebih dari 0"),
  hargaPerKg: z.number().positive("Harga per kg harus lebih dari 0"),
  keterangan: z.string().optional(),
});

export type CreatePembelianPakanInput = z.infer<typeof createPembelianPakanSchema>;

export const updatePembelianPakanSchema = createPembelianPakanSchema.partial();

export type UpdatePembelianPakanInput = z.infer<typeof updatePembelianPakanSchema>;
