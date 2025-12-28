import { NextRequest } from "next/server";

import { PembelianPakanController } from "../index";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return PembelianPakanController.update(req, params);
}
