import { NextRequest } from "next/server";

import { PembelianPakanController } from "./index";

export async function GET(req: NextRequest) {
  return PembelianPakanController.getAll(req);
}

export async function POST(req: NextRequest) {
  return PembelianPakanController.create(req);
}
