import { NextRequest } from "next/server";

import { KematianAyamController } from "./index";

export async function GET(req: NextRequest) {
  return KematianAyamController.getAll(req);
}

export async function POST(req: NextRequest) {
  return KematianAyamController.create(req);
}
