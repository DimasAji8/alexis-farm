import { NextRequest } from "next/server";
import { JenisPakanController } from "./index";

export async function GET(req: NextRequest) {
  return JenisPakanController.getAll(req);
}

export async function POST(req: NextRequest) {
  return JenisPakanController.create(req);
}
