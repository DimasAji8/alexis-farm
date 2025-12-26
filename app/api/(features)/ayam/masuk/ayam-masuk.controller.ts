import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { AyamMasukService } from "./ayam-masuk.service";
import { createAyamMasukSchema } from "./ayam-masuk.validation";

export class AyamMasukController {
  static async getAll() {
    try {
      const data = await AyamMasukService.getAll();
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
}
