import { NextRequest } from "next/server";

import { KematianAyamController } from "../index";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return KematianAyamController.update(req, params);
}
