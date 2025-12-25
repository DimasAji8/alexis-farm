import { NextRequest } from "next/server";

import { KandangController } from "./index";

export async function GET() {
  return KandangController.getAll();
}

export async function POST(req: NextRequest) {
  return KandangController.create(req);
}
