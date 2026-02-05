import { NextRequest } from "next/server";
import { PemasukanController } from "./pemasukan.controller";

export async function GET(req: NextRequest) {
  return PemasukanController.getAll(req);
}

export async function POST(req: NextRequest) {
  return PemasukanController.create(req);
}
