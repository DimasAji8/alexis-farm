import { NextRequest } from "next/server";
import { RekapPakanController } from "./index";

export async function GET(req: NextRequest) {
  return RekapPakanController.getRekapBulanan(req);
}
