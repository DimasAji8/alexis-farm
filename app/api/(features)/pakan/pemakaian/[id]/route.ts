import { NextRequest } from "next/server";

import { PemakaianPakanController } from "../index";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return PemakaianPakanController.update(req, params);
}
