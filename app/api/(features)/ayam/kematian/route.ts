import { NextRequest } from "next/server";

import { KematianAyamController } from "./index";

export async function GET() {
  return KematianAyamController.getAll();
}

export async function POST(req: NextRequest) {
  return KematianAyamController.create(req);
}
