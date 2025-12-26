import { prisma } from "@/app/api/db/prisma";

type AdjustInput = {
  tanggal: Date;
  deltaButir: number;
  deltaKg: number;
};

export class StockTelurService {
  static async getAll() {
    return prisma.stockTelur.findMany({
      orderBy: { tanggal: "desc" },
    });
  }

  static async adjustStock({ tanggal, deltaButir, deltaKg }: AdjustInput) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.stockTelur.findFirst({
        where: { tanggal },
      });

      if (!existing) {
        const stockButir = Math.max(0, deltaButir);
        const stockKg = Math.max(0, deltaKg);
        return tx.stockTelur.create({
          data: {
            tanggal,
            stockButir,
            stockKg,
          },
        });
      }

      const newButir = existing.stockButir + deltaButir;
      const newKg = existing.stockKg + deltaKg;

      if (newButir < 0 || newKg < 0) {
        throw new Error("Stok telur tidak cukup");
      }

      return tx.stockTelur.update({
        where: { tanggal },
        data: {
          stockButir: newButir,
          stockKg: newKg,
        },
      });
    });
  }
}
