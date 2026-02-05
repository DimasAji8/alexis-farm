import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { AyamMasukService } from "./ayam-masuk.service";
import { createAyamMasukSchema } from "./ayam-masuk.validation";

export class AyamMasukController {
  static async getAll(req: NextRequest) {
    try {
      const { searchParams } = req.nextUrl;
      const type = searchParams.get("type");
      const kandangId = searchParams.get("kandangId") || undefined;
      const bulan = searchParams.get("bulan") || undefined;
      
      if (type === "summary" && kandangId) {
        const data = await AyamMasukService.getSummary(kandangId, bulan);
        return apiResponse(data, "Summary berhasil diambil");
      }
      
      const data = await AyamMasukService.getAll(kandangId, bulan);
      return apiResponse(data, "Riwayat ayam masuk berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }

  static async create(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = createAyamMasukSchema.parse(body);
      const data = await AyamMasukService.create(validated);
      return apiResponse(data, "Ayam masuk berhasil dicatat", 201);
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
      const validated = createAyamMasukSchema.partial().parse(body);
      const data = await AyamMasukService.update(id, validated);
      return apiResponse(data, "Ayam masuk berhasil diperbarui");
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
      await AyamMasukService.delete(id);
      return apiResponse(null, "Ayam masuk berhasil dihapus");
    } catch (error) {
      return apiError(error);
    }
  }
}
