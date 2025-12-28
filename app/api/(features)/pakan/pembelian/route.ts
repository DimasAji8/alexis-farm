import { NextRequest } from "next/server";

import { PembelianPakanController } from "./index";

export async function GET() {
  return PembelianPakanController.getAll();
}

export async function POST(req: NextRequest) {
  return PembelianPakanController.create(req);
}
