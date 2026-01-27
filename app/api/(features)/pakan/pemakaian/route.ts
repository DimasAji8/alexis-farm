import { NextRequest } from "next/server";

import { PemakaianPakanController } from "./index";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  
  if (type === "daily-summary") {
    return PemakaianPakanController.getDailySummary(req);
  }
  
  return PemakaianPakanController.getAll();
}

export async function POST(req: NextRequest) {
  return PemakaianPakanController.create(req);
}
