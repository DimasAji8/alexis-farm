import { NextRequest } from "next/server";

import { PengeluaranOperasionalController } from "../index";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return PengeluaranOperasionalController.update(req, params);
}
