import { NextRequest } from "next/server";

import { PemakaianPakanController } from "./index";

export async function GET() {
  return PemakaianPakanController.getAll();
}

export async function POST(req: NextRequest) {
  return PemakaianPakanController.create(req);
}
