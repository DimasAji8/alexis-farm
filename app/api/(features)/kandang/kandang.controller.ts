import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { KandangService } from "./kandang.service";
import { createKandangSchema, updateKandangSchema } from "./kandang.validation";

export class KandangController {
  static async getAll() {
    try {
      const data = await KandangService.getAll();
      return apiResponse(data, "Daftar kandang berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }

  static async getById(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const data = await KandangService.getById(params.id);
      return apiResponse(data, "Kandang berhasil diambil");
    } catch (error) {
      return apiError(error, "Kandang tidak ditemukan", 404);
    }
  }

  static async create(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = createKandangSchema.parse(body);
      const data = await KandangService.create(validated);
      return apiResponse(data, "Kandang berhasil dibuat", 201);
    } catch (error) {
      return apiError(error);
    }
  }

  static async update(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await req.json();
      const validated = updateKandangSchema.parse(body);
      const data = await KandangService.update(params.id, validated);
      return apiResponse(data, "Kandang berhasil diperbarui");
    } catch (error) {
      return apiError(error);
    }
  }

  static async delete(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const data = await KandangService.delete(params.id);
      return apiResponse(data, "Kandang berhasil dihapus");
    } catch (error) {
      return apiError(error, "Kandang tidak ditemukan", 404);
    }
  }
}
