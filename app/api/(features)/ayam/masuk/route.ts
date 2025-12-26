import { NextRequest } from "next/server";

import { AyamMasukController } from "./index";

export async function GET() {
  return AyamMasukController.getAll();
}

export async function POST(req: NextRequest) {
  return AyamMasukController.create(req);
}
