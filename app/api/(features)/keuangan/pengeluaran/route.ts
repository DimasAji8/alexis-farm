import { NextRequest } from "next/server";
import { PengeluaranOperasionalController } from "./index";

export async function GET() {
  return PengeluaranOperasionalController.getAll();
}

export async function POST(req: NextRequest) {
  return PengeluaranOperasionalController.create(req);
}
