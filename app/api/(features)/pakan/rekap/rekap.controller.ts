import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { RekapPakanService } from "./rekap.service";
import { rekapPakanQuerySchema } from "./rekap.validation";

export class RekapPakanController {
  static async get(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const parsed = rekapPakanQuerySchema.parse({
        bulan: searchParams.get("bulan"),
        jenisPakanId: searchParams.get("jenisPakanId") ?? undefined,
        harian: searchParams.get("harian") ?? undefined,
      });
      const data = await RekapPakanService.getRekapPerJenis(parsed);
      return apiResponse(data, "Rekap pakan berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }
}
