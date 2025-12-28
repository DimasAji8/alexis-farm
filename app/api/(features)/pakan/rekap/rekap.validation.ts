import { z } from "zod";

export const rekapPakanQuerySchema = z.object({
  bulan: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Format bulan YYYY-MM (misal 2025-11)")
    .transform((val) => {
      const [year, month] = val.split("-").map(Number);
      const start = new Date(Date.UTC(year, month - 1, 1));
      const end = new Date(Date.UTC(year, month, 1));
      return { start, end };
    }),
  jenisPakanId: z.string().optional(),
  harian: z
    .string()
    .optional()
    .transform((val) => val === "true" || val === "1")
    .optional(),
  byKandang: z
    .string()
    .optional()
    .transform((val) => val === "true" || val === "1")
    .optional(),
});

export type RekapPakanQuery = z.infer<typeof rekapPakanQuerySchema>;
