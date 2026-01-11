import { NextRequest } from "next/server";

import { AyamMasukController } from "./index";

export async function GET(req: NextRequest) {
  return AyamMasukController.getAll(req);
}

export async function POST(req: NextRequest) {
  return AyamMasukController.create(req);
}
