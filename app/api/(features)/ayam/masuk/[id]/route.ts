import { NextRequest } from "next/server";

import { AyamMasukController } from "../index";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return AyamMasukController.update(req, params);
}
