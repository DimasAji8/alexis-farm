import { NextRequest } from "next/server";

import { TransaksiKeuanganController } from "./index";

export async function GET(req: NextRequest) {
  return TransaksiKeuanganController.getAll(req);
}

export async function POST(req: NextRequest) {
  return TransaksiKeuanganController.create(req);
}
