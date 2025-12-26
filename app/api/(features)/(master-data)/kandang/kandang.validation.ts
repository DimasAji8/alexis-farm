import { z } from "zod";

const statusEnum = ["aktif", "tidak_aktif", "maintenance"] as const;

export const createKandangSchema = z.object({
  kode: z
    .string()
    .min(1, "Kode kandang wajib diisi")
    .max(10, "Kode maksimal 10 karakter")
    .regex(/^[A-Z0-9]+$/, "Kode hanya boleh huruf kapital dan angka"),
  nama: z.string().min(1, "Nama kandang wajib diisi").max(50, "Nama maksimal 50 karakter"),
  lokasi: z.string().optional(),
  status: z.enum(statusEnum).default("aktif"),
  keterangan: z.string().optional(),
});

export const updateKandangSchema = createKandangSchema.partial();

export type CreateKandangInput = z.infer<typeof createKandangSchema>;
export type UpdateKandangInput = z.infer<typeof updateKandangSchema>;
