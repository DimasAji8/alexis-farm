import { prisma } from "@/app/api/db/prisma";
import { requireRole } from "@/app/api/shared/utils/auth-guard";
import { NotFoundError, ValidationError } from "@/app/api/shared/utils/errors";
import type { CreatePemakaianPakanInput, UpdatePemakaianPakanInput } from "./pemakaian.validation";

export class PemakaianPakanService {
  static async getAll() {
    return prisma.pemakaianPakanHeader.findMany({
      orderBy: { tanggalPakai: "desc" },
      include: {
        kandang: { select: { id: true, kode: true, nama: true } },
        jenisPakan: { select: { id: true, kode: true, nama: true, satuan: true } },
        details: {
          include: {
            pembelianPakan: { select: { id: true, tanggalBeli: true, hargaPerKg: true } },
          },
        },
      },
    });
  }

  static async getById(id: string) {
    const pemakaian = await prisma.pemakaianPakanHeader.findUnique({
      where: { id },
      include: {
        kandang: { select: { id: true, kode: true, nama: true } },
        jenisPakan: { select: { id: true, kode: true, nama: true, satuan: true } },
        details: {
          include: {
            pembelianPakan: { select: { id: true, tanggalBeli: true, hargaPerKg: true } },
          },
        },
      },
    });
    if (!pemakaian) {
      throw new NotFoundError("Pemakaian pakan tidak ditemukan");
    }
    return pemakaian;
  }

  static async create(data: CreatePemakaianPakanInput) {
    const userId = await requireRole(["super_user", "staff"]);

    const kandang = await prisma.kandang.findUnique({ where: { id: data.kandangId } });
    if (!kandang) throw new NotFoundError("Kandang tidak ditemukan");

    const jenisPakan = await prisma.jenisPakan.findUnique({ where: { id: data.jenisPakanId } });
    if (!jenisPakan) throw new NotFoundError("Jenis pakan tidak ditemukan");

    const stokTersedia = await prisma.pembelianPakan.aggregate({
      where: { jenisPakanId: data.jenisPakanId, sisaStokKg: { gt: 0 } },
      _sum: { sisaStokKg: true },
    });

    if (!stokTersedia._sum.sisaStokKg || stokTersedia._sum.sisaStokKg < data.jumlahKg) {
      throw new ValidationError("Stok pakan tidak mencukupi");
    }

    const batchesFIFO = await prisma.pembelianPakan.findMany({
      where: { jenisPakanId: data.jenisPakanId, sisaStokKg: { gt: 0 } },
      orderBy: { tanggalBeli: "asc" },
    });

    let sisaKebutuhan = data.jumlahKg;
    let totalBiaya = 0;
    const details: Array<{ pembelianPakanId: string; jumlahKg: number; hargaPerKg: number; totalBiaya: number }> = [];

    for (const batch of batchesFIFO) {
      if (sisaKebutuhan <= 0) break;

      const ambil = Math.min(sisaKebutuhan, batch.sisaStokKg);
      const biaya = ambil * batch.hargaPerKg;

      details.push({
        pembelianPakanId: batch.id,
        jumlahKg: ambil,
        hargaPerKg: batch.hargaPerKg,
        totalBiaya: biaya,
      });

      totalBiaya += biaya;
      sisaKebutuhan -= ambil;
    }

    return prisma.$transaction(async (tx) => {
      const header = await tx.pemakaianPakanHeader.create({
        data: {
          kandangId: data.kandangId,
          jenisPakanId: data.jenisPakanId,
          tanggalPakai: data.tanggalPakai,
          jumlahKg: data.jumlahKg,
          totalBiaya,
          keterangan: data.keterangan,
          createdBy: userId,
        },
      });

      for (const detail of details) {
        await tx.pemakaianPakanDetail.create({
          data: {
            headerId: header.id,
            ...detail,
          },
        });

        await tx.pembelianPakan.update({
          where: { id: detail.pembelianPakanId },
          data: { sisaStokKg: { decrement: detail.jumlahKg } },
        });
      }

      return tx.pemakaianPakanHeader.findUnique({
        where: { id: header.id },
        include: {
          kandang: { select: { id: true, kode: true, nama: true } },
          jenisPakan: { select: { id: true, kode: true, nama: true, satuan: true } },
          details: {
            include: {
              pembelianPakan: { select: { id: true, tanggalBeli: true, hargaPerKg: true } },
            },
          },
        },
      });
    });
  }

  static async update(id: string, data: UpdatePemakaianPakanInput) {
    const userId = await requireRole(["super_user", "staff"]);
    const existing = await this.getById(id);

    for (const detail of existing.details) {
      await prisma.pembelianPakan.update({
        where: { id: detail.pembelianPakanId },
        data: { sisaStokKg: { increment: detail.jumlahKg } },
      });
    }

    await prisma.pemakaianPakanDetail.deleteMany({ where: { headerId: id } });

    const jenisPakanId = data.jenisPakanId ?? existing.jenisPakanId;
    const jumlahKg = data.jumlahKg ?? existing.jumlahKg;

    const stokTersedia = await prisma.pembelianPakan.aggregate({
      where: { jenisPakanId, sisaStokKg: { gt: 0 } },
      _sum: { sisaStokKg: true },
    });

    if (!stokTersedia._sum.sisaStokKg || stokTersedia._sum.sisaStokKg < jumlahKg) {
      throw new ValidationError("Stok pakan tidak mencukupi");
    }

    const batchesFIFO = await prisma.pembelianPakan.findMany({
      where: { jenisPakanId, sisaStokKg: { gt: 0 } },
      orderBy: { tanggalBeli: "asc" },
    });

    let sisaKebutuhan = jumlahKg;
    let totalBiaya = 0;
    const details: Array<{ pembelianPakanId: string; jumlahKg: number; hargaPerKg: number; totalBiaya: number }> = [];

    for (const batch of batchesFIFO) {
      if (sisaKebutuhan <= 0) break;

      const ambil = Math.min(sisaKebutuhan, batch.sisaStokKg);
      const biaya = ambil * batch.hargaPerKg;

      details.push({
        pembelianPakanId: batch.id,
        jumlahKg: ambil,
        hargaPerKg: batch.hargaPerKg,
        totalBiaya: biaya,
      });

      totalBiaya += biaya;
      sisaKebutuhan -= ambil;
    }

    return prisma.$transaction(async (tx) => {
      await tx.pemakaianPakanHeader.update({
        where: { id },
        data: {
          kandangId: data.kandangId ?? existing.kandangId,
          jenisPakanId,
          tanggalPakai: data.tanggalPakai ?? existing.tanggalPakai,
          jumlahKg,
          totalBiaya,
          keterangan: data.keterangan ?? existing.keterangan,
          updatedBy: userId,
        },
      });

      for (const detail of details) {
        await tx.pemakaianPakanDetail.create({
          data: {
            headerId: id,
            ...detail,
          },
        });

        await tx.pembelianPakan.update({
          where: { id: detail.pembelianPakanId },
          data: { sisaStokKg: { decrement: detail.jumlahKg } },
        });
      }

      return tx.pemakaianPakanHeader.findUnique({
        where: { id },
        include: {
          kandang: { select: { id: true, kode: true, nama: true } },
          jenisPakan: { select: { id: true, kode: true, nama: true, satuan: true } },
          details: {
            include: {
              pembelianPakan: { select: { id: true, tanggalBeli: true, hargaPerKg: true } },
            },
          },
        },
      });
    });
  }

  static async delete(id: string) {
    await requireRole(["super_user"]);
    const existing = await this.getById(id);

    return prisma.$transaction(async (tx) => {
      for (const detail of existing.details) {
        await tx.pembelianPakan.update({
          where: { id: detail.pembelianPakanId },
          data: { sisaStokKg: { increment: detail.jumlahKg } },
        });
      }

      await tx.pemakaianPakanHeader.delete({ where: { id } });
    });
  }
}
