import { NextRequest } from "next/server";
import { PengeluaranOperasionalController } from "./index";

export async function GET(req: NextRequest) {
  return PengeluaranOperasionalController.getAll(req);
}

export async function POST(req: NextRequest) {
  return PengeluaranOperasionalController.create(req);
}
