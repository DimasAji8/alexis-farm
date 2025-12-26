import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { KematianAyamService } from "./kematian-ayam.service";
import { createKematianAyamSchema } from "./kematian-ayam.validation";

export class KematianAyamController {
  static async getAll() {
    try {
      const data = await KematianAyamService.getAll();
      return apiResponse(data, "Riwayat kematian ayam berhasil diambil");
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
}
