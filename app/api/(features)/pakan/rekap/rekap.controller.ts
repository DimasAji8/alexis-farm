import { NextRequest } from "next/server";
import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";
import { RekapPakanService } from "./rekap.service";

export class RekapPakanController {
  static async getRekapBulanan(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const bulan = searchParams.get("bulan");

      if (!bulan) {
        throw new Error("Parameter bulan wajib diisi (format: YYYY-MM)");
      }

      const data = await RekapPakanService.getRekapBulanan(bulan);
      return apiResponse(data, "Rekap pakan berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }
}
