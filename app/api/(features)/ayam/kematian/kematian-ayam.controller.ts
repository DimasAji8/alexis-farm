import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { KematianAyamService } from "./kematian-ayam.service";
import { createKematianAyamSchema } from "./kematian-ayam.validation";

export class KematianAyamController {
  static async getAll(req: NextRequest) {
    try {
      const { searchParams } = req.nextUrl;
      const kandangId = searchParams.get("kandangId") || undefined;
      const bulan = searchParams.get("bulan") || undefined;
      
      if (!kandangId) {
        return apiResponse({ list: [], summary: null }, "Kandang ID wajib diisi");
      }
      
      const [list, summary] = await Promise.all([
        KematianAyamService.getAll(kandangId, bulan),
        KematianAyamService.getSummary(kandangId, bulan),
      ]);
      
      return apiResponse({ list, summary }, "Riwayat kematian ayam berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }

  static async create(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = createKematianAyamSchema.parse(body);
      const data = await KematianAyamService.create(validated);
      return apiResponse(data, "Kematian ayam berhasil dicatat", 201);
    } catch (error) {
      return apiError(error);
    }
  }

  static async update(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const id = params.id;
      if (!id) {
        throw new Error("Parameter id wajib diisi");
      }
      const body = await req.json();
      const validated = createKematianAyamSchema.partial().parse(body);
      const data = await KematianAyamService.update(id, validated);
      return apiResponse(data, "Kematian ayam berhasil diperbarui");
    } catch (error) {
      return apiError(error);
    }
  }

  static async delete({ params }: { params: { id: string } }) {
    try {
      const id = params.id;
      if (!id) {
        throw new Error("Parameter id wajib diisi");
      }
      await KematianAyamService.delete(id);
      return apiResponse(null, "Kematian ayam berhasil dihapus");
    } catch (error) {
      return apiError(error);
    }
  }
}
