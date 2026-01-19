import { NextRequest } from "next/server";
import { JenisPakanController } from "./index";

export async function GET() {
  return JenisPakanController.getAll();
}

export async function POST(req: NextRequest) {
  return JenisPakanController.create(req);
}
