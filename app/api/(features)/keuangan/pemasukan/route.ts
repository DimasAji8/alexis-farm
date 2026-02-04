import { NextRequest } from "next/server";
import { PemasukanController } from "./pemasukan.controller";

export async function GET() {
  return PemasukanController.getAll();
}

export async function POST(req: NextRequest) {
  return PemasukanController.create(req);
}
