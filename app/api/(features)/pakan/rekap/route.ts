import { NextRequest } from "next/server";
import { RekapPakanController } from "./index";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  
  if (type === "harian") {
    return RekapPakanController.getRekapHarian(req);
  }
  
  return RekapPakanController.getRekapBulanan(req);
}
