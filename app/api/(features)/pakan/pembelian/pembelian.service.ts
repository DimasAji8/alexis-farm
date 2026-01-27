import { prisma } from "@/app/api/db/prisma";

import { requireRole } from "@/app/api/shared/utils/auth-guard";
import { NotFoundError, ValidationError } from "@/app/api/shared/utils/errors";
import type { CreatePembelianPakanInput, UpdatePembelianPakanInput } from "./pembelian.validation";

export class PembelianPakanService {
  static async getAll() {
    return prisma.pembelianPakan.findMany({
      orderBy: { tanggalBeli: "asc" },
      include: {
        jenisPakan: { select: { id: true, kode: true, nama: true, satuan: true } },
      },
    });
  }

  static async getSummary(bulan?: string, jenisPakanId?: string) {
    // Build where clause
    const where: any = {};
    
    if (bulan) {
      const [year, month] = bulan.split("-");
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      where.tanggalBeli = { gte: startDate, lte: endDate };
    }
    
    if (jenisPakanId) {
      where.jenisPakanId = jenisPakanId;
    }

    // Get filtered data
    const data = await prisma.pembelianPakan.findMany({
      where,
      include: {
        jenisPakan: { select: { id: true, kode: true, nama: true } },
      },
    });

    // Calculate summary
    const totalPembelian = data.reduce((sum, item) => sum + item.totalHarga, 0);
    const rataRataHargaPerKg = data.length > 0 
      ? data.reduce((sum, item) => sum + item.hargaPerKg, 0) / data.length 
      : 0;
    
    // Get total stok (all data, not filtered)
    const allData = await prisma.pembelianPakan.findMany();
    const totalStok = allData.reduce((sum, item) => sum + item.sisaStokKg, 0);
    
    const totalTransaksi = data.length;

    return {
      totalPembelian,
      rataRataHargaPerKg: Math.round(rataRataHargaPerKg),
      totalStok,
      totalTransaksi,
    };
  }

  static async getById(id: string) {
    const pembelian = await prisma.pembelianPakan.findUnique({
      where: { id },
      include: { jenisPakan: { select: { id: true, kode: true, nama: true, satuan: true } } },
    });
    if (!pembelian) {
      throw new NotFoundError("Pembelian pakan tidak ditemukan");
    }
    return pembelian;
  }

  static async create(data: CreatePembelianPakanInput) {
    const userId = await requireRole(["super_user", "staff"]);
    const jenis = await prisma.jenisPakan.findUnique({ where: { id: data.jenisPakanId } });
    if (!jenis) {
      throw new NotFoundError("Jenis pakan tidak ditemukan");
    }

    const totalHarga = data.jumlahKg * data.hargaPerKg;

    return prisma.pembelianPakan.create({
      data: {
        jenisPakanId: data.jenisPakanId,
        tanggalBeli: data.tanggalBeli,
        jumlahKg: data.jumlahKg,
        hargaPerKg: data.hargaPerKg,
        totalHarga,
        sisaStokKg: data.jumlahKg,
        keterangan: data.keterangan,
        createdBy: userId,
      },
    });
  }

  static async update(id: string, data: UpdatePembelianPakanInput) {
    const userId = await requireRole(["super_user", "staff"]);
    const existing = await prisma.pembelianPakan.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Pembelian pakan tidak ditemukan");
    }

    const usedKg = existing.jumlahKg - existing.sisaStokKg;
    const newJumlahKg = data.jumlahKg ?? existing.jumlahKg;
    if (newJumlahKg < usedKg) {
      throw new ValidationError("Jumlah baru tidak boleh kurang dari total yang sudah terpakai");
    }

    const jenisPakanId = data.jenisPakanId ?? existing.jenisPakanId;
    const jenis = await prisma.jenisPakan.findUnique({ where: { id: jenisPakanId } });
    if (!jenis) {
      throw new NotFoundError("Jenis pakan tidak ditemukan");
    }

    const hargaPerKg = data.hargaPerKg ?? existing.hargaPerKg;
    const totalHarga = newJumlahKg * hargaPerKg;
    const sisaStokKg = newJumlahKg - usedKg;
    const tanggalBeli = data.tanggalBeli ?? existing.tanggalBeli;

    return prisma.pembelianPakan.update({
      where: { id },
      data: {
        jenisPakanId,
        tanggalBeli,
        jumlahKg: newJumlahKg,
        hargaPerKg,
        totalHarga,
        sisaStokKg,
        keterangan: data.keterangan ?? existing.keterangan,
        updatedBy: userId ?? undefined,
      },
    });
  }
}
