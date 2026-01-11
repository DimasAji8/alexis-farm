import { z } from "zod";

export const createPenjualanTelurSchema = z.object({
  kandangId: z.string().min(1, "Kandang wajib dipilih"),
  tanggal: z.coerce.date({ error: "Tanggal wajib diisi" }),
  deskripsi: z.string().optional(),
  pembeli: z.string().optional(),
  beratKg: z.number().positive("Berat harus lebih dari 0"),
  hargaPerKg: z.number().positive("Harga per kg harus lebih dari 0"),
  uangMasuk: z.number().min(0).optional(),
  uangKeluar: z.number().min(0).optional(),
  metodeBayar: z.string().optional(),
  nomorTransaksi: z.string().optional(),
});

export type CreatePenjualanTelurInput = z.infer<typeof createPenjualanTelurSchema>;

export const updatePenjualanTelurSchema = createPenjualanTelurSchema.partial();

export type UpdatePenjualanTelurInput = z.infer<typeof updatePenjualanTelurSchema>;
