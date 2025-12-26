import { z } from "zod";

export const createJenisPakanSchema = z.object({
  kode: z
    .string()
    .min(1, "Kode pakan wajib diisi")
    .max(20, "Kode maksimal 20 karakter")
    .regex(/^[A-Z0-9]+$/, "Kode hanya boleh huruf kapital dan angka"),
  nama: z.string().min(1, "Nama pakan wajib diisi").max(100, "Nama maksimal 100 karakter"),
  satuan: z.string().min(1, "Satuan wajib diisi").max(10, "Satuan maksimal 10 karakter").default("KG"),
  keterangan: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateJenisPakanSchema = createJenisPakanSchema.partial();

export type CreateJenisPakanInput = z.infer<typeof createJenisPakanSchema>;
export type UpdateJenisPakanInput = z.infer<typeof updateJenisPakanSchema>;
