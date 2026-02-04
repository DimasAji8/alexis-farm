import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { KandangService } from "./kandang.service";
import { createKandangSchema, updateKandangSchema } from "./kandang.validation";

function extractId(req: NextRequest, params?: { id?: string }) {
  const fromParams = params?.id;
  if (fromParams) return fromParams;

  const last = req.nextUrl.pathname.split("/").pop();
  if (last) return last;

  throw new Error("Parameter id wajib diisi");
}

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
      const id = extractId(_req, params);
      const data = await KandangService.getById(id);
      return apiResponse(data, "Kandang berhasil diambil");
    } catch (error) {
      return apiError(error);
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
      const id = extractId(req, params);
      const body = await req.json();
      const validated = updateKandangSchema.parse(body);
      const data = await KandangService.update(id, validated);
      return apiResponse(data, "Kandang berhasil diperbarui");
    } catch (error) {
      return apiError(error);
    }
  }

  static async delete(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const id = extractId(_req, params);
      const data = await KandangService.delete(id);
      return apiResponse(data, "Kandang berhasil dihapus");
    } catch (error) {
      return apiError(error);
    }
  }
}
