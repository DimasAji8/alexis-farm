import { NextRequest, NextResponse } from "next/server";
import { RekapTelurService } from "./rekap.service";

export class RekapTelurController {
  static async getRekapHarian(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const kandangId = searchParams.get("kandangId");
      const bulan = searchParams.get("bulan");

      if (!kandangId || !bulan) {
        return NextResponse.json({ success: false, message: "kandangId dan bulan wajib diisi" }, { status: 400 });
      }

      const data = await RekapTelurService.getRekapHarian(kandangId, bulan);
      return NextResponse.json({ success: true, data });
    } catch (error: any) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }
}
