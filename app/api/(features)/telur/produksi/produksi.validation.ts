import { z } from "zod";

export const createProduksiTelurSchema = z.object({
  kandangId: z.string().min(1, "Kandang wajib diisi"),
  tanggal: z.coerce.date({ required_error: "Tanggal wajib diisi" }),
  jumlahBagusButir: z.number().int().min(0, "Telur bagus minimal 0"),
  jumlahTidakBagusButir: z.number().int().min(0, "Telur tidak bagus minimal 0").default(0),
  totalKg: z.number().min(0, "Total berat minimal 0").default(0),
  keterangan: z.string().optional(),
});

export type CreateProduksiTelurInput = z.infer<typeof createProduksiTelurSchema>;

export const updateProduksiTelurSchema = createProduksiTelurSchema.partial();

export type UpdateProduksiTelurInput = z.infer<typeof updateProduksiTelurSchema>;
