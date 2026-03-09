import { prisma } from "@/app/api/db/prisma";
import { requireRole } from "@/app/api/shared/utils/auth-guard";
import { NotFoundError, ValidationError } from "@/app/api/shared/utils/errors";
import { validateJenisPakanRelations } from "@/app/api/shared/utils/relation-validator";
import type { CreateJenisPakanInput, UpdateJenisPakanInput } from "./jenis-pakan.validation";

export class JenisPakanService {
  static async getAll(kandangId?: string) {
    const where = kandangId ? { kandangId } : {};
    return prisma.jenisPakan.findMany({
      where,
      include: { kandang: true },
      orderBy: { nama: "asc" },
    });
  }

  static async getActive(kandangId?: string) {
    const where = kandangId ? { kandangId, isActive: true } : { isActive: true };
    return prisma.jenisPakan.findMany({
      where,
      include: { kandang: true },
      orderBy: { nama: "asc" },
    });
  }

  static async getById(id: string) {
    const jenisPakan = await prisma.jenisPakan.findUnique({ 
      where: { id },
      include: { kandang: true },
    });
    if (!jenisPakan) {
      throw new NotFoundError("Jenis pakan tidak ditemukan");
    }
    return jenisPakan;
  }

  static async create(data: CreateJenisPakanInput) {
    const userId = await requireRole(["super_user", "staff"]);
    
    // Validasi kandang exists
    const kandang = await prisma.kandang.findUnique({ where: { id: data.kandangId } });
    if (!kandang) {
      throw new ValidationError("Kandang tidak ditemukan");
    }
    
    // Check kode unik per kandang
    const existing = await prisma.jenisPakan.findUnique({ 
      where: { 
        kandangId_kode: {
          kandangId: data.kandangId,
          kode: data.kode,
        }
      } 
    });
    if (existing) {
      throw new ValidationError("Kode pakan sudah digunakan di kandang ini");
    }

    return prisma.jenisPakan.create({
      data: {
        ...data,
        createdBy: userId,
      },
      include: { kandang: true },
    });
  }

  static async update(id: string, data: UpdateJenisPakanInput) {
    const userId = await requireRole(["super_user", "manager", "staff"]);
    
    const existing = await prisma.jenisPakan.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Jenis pakan tidak ditemukan");
    }

    // Jika mengubah kandang atau kode, cek uniqueness
    if ((data.kandangId || data.kode) && (data.kandangId !== existing.kandangId || data.kode !== existing.kode)) {
      const kandangId = data.kandangId || existing.kandangId;
      const kode = data.kode || existing.kode;
      
      const duplicate = await prisma.jenisPakan.findUnique({ 
        where: { 
          kandangId_kode: {
            kandangId,
            kode,
          }
        } 
      });
      if (duplicate && duplicate.id !== id) {
        throw new ValidationError("Kode pakan sudah digunakan di kandang ini");
      }
    }

    return prisma.jenisPakan.update({
      where: { id },
      data: {
        ...data,
        updatedBy: userId,
      },
      include: { kandang: true },
    });
  }

  static async delete(id: string) {
    await requireRole(["super_user"]);
    
    const existing = await prisma.jenisPakan.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Jenis pakan tidak ditemukan");
    }

    await validateJenisPakanRelations(id);

    return prisma.jenisPakan.update({
      where: { id },
      data: { isActive: false },
      include: { kandang: true },
    });
  }
}
