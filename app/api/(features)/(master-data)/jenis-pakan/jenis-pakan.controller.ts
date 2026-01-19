import { NextRequest } from "next/server";
import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";
import { JenisPakanService } from "./jenis-pakan.service";
import { createJenisPakanSchema } from "./jenis-pakan.validation";

export class JenisPakanController {
  static async getAll() {
    try {
      const data = await JenisPakanService.getAll();
      return apiResponse(data, "Jenis pakan berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }

  static async getById(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const data = await JenisPakanService.getById(params.id);
      return apiResponse(data, "Jenis pakan berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }

  static async create(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = createJenisPakanSchema.parse(body);
      const data = await JenisPakanService.create(validated);
      return apiResponse(data, "Jenis pakan berhasil ditambahkan", 201);
    } catch (error) {
      return apiError(error);
    }
  }

  static async update(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await req.json();
      const validated = createJenisPakanSchema.partial().parse(body);
      const data = await JenisPakanService.update(params.id, validated);
      return apiResponse(data, "Jenis pakan berhasil diperbarui");
    } catch (error) {
      return apiError(error);
    }
  }

  static async delete(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      await JenisPakanService.delete(params.id);
      return apiResponse(null, "Jenis pakan berhasil dihapus");
    } catch (error) {
      return apiError(error);
    }
  }
}
