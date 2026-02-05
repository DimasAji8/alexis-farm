import { NextRequest } from "next/server";
import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";
import { PemasukanService } from "./pemasukan.service";
import { createPemasukanSchema, updatePemasukanSchema } from "./pemasukan.validation";

export class PemasukanController {
  static async getAll(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const bulan = searchParams.get('bulan');
      const data = await PemasukanService.getAll(bulan || undefined);
      return apiResponse(data, "Daftar pemasukan berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }

  static async create(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = createPemasukanSchema.parse(body);
      const data = await PemasukanService.create(validated);
      return apiResponse(data, "Pemasukan berhasil ditambahkan", 201);
    } catch (error) {
      return apiError(error);
    }
  }

  static async update(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await req.json();
      const validated = updatePemasukanSchema.parse(body);
      const data = await PemasukanService.update(params.id, validated);
      return apiResponse(data, "Pemasukan berhasil diperbarui");
    } catch (error) {
      return apiError(error);
    }
  }

  static async delete(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const data = await PemasukanService.delete(params.id);
      return apiResponse(data, "Pemasukan berhasil dihapus");
    } catch (error) {
      return apiError(error);
    }
  }
}
