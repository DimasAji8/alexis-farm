import { prisma } from "@/app/api/db/prisma";

type AdjustInput = {
  kandangId: string;
  tanggal: Date;
  deltaButir: number;
  deltaKg: number;
};

export class StockTelurService {
  static async getAll(kandangId?: string, bulan?: string) {
    const where: any = kandangId ? { kandangId } : {};
    
    let stokAwal = 0;
    
    if (bulan) {
      const [year, month] = bulan.split("-");
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      where.tanggal = { gte: startDate, lte: endDate };
      
      // Get stok akhir bulan sebelumnya
      const prevMonthStock = await prisma.stockTelur.findFirst({
        where: {
          kandangId,
          tanggal: { lt: startDate },
        },
        orderBy: { tanggal: "desc" },
      });
      
      stokAwal = prevMonthStock?.stockKg || 0;
    }
    
    const data = await prisma.stockTelur.findMany({
      where,
      orderBy: { tanggal: "asc" },
      include: { kandang: { select: { id: true, kode: true, nama: true } } },
    });
    
    return { data, stokAwal };
  }

  static async getLatestStock(kandangId: string, beforeDate?: Date) {
    return prisma.stockTelur.findFirst({
      where: {
        kandangId,
        ...(beforeDate && { tanggal: { lt: beforeDate } }),
      },
      orderBy: { tanggal: "desc" },
    });
  }

  static async adjustStock({ kandangId, tanggal, deltaButir, deltaKg }: AdjustInput) {
    return prisma.$transaction(async (tx) => {
      // Ambil stok terakhir sebelum atau sama dengan tanggal ini
      const lastStock = await tx.stockTelur.findFirst({
        where: { kandangId, tanggal: { lte: tanggal } },
        orderBy: { tanggal: "desc" },
      });

      // Cek apakah sudah ada record untuk tanggal ini
      const existingToday = await tx.stockTelur.findUnique({
        where: { kandangId_tanggal: { kandangId, tanggal } },
      });

      const baseButir = lastStock?.stockButir ?? 0;
      const baseKg = lastStock?.stockKg ?? 0;

      let newButir: number;
      let newKg: number;

      if (existingToday) {
        // Jika sudah ada record hari ini, tambahkan delta ke nilai yang ada
        newButir = existingToday.stockButir + deltaButir;
        newKg = existingToday.stockKg + deltaKg;
      } else {
        // Jika belum ada, gunakan base + delta
        newButir = baseButir + deltaButir;
        newKg = baseKg + deltaKg;
      }

      if (newButir < 0 || newKg < 0) {
        throw new Error("Stok telur tidak cukup");
      }

      // Upsert record untuk tanggal ini
      const updated = await tx.stockTelur.upsert({
        where: { kandangId_tanggal: { kandangId, tanggal } },
        create: { kandangId, tanggal, stockButir: newButir, stockKg: newKg },
        update: { stockButir: newButir, stockKg: newKg },
      });

      // Update semua record setelah tanggal ini (propagate delta)
      await tx.stockTelur.updateMany({
        where: { kandangId, tanggal: { gt: tanggal } },
        data: {
          stockButir: { increment: deltaButir },
          stockKg: { increment: deltaKg },
        },
      });

      return updated;
    });
  }
}
