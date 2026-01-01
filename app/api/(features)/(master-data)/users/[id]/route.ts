import { NextRequest } from "next/server";

import { UsersController } from "../index";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, { params }: Params) {
  const resolvedParams = await params;
  return UsersController.delete(req, { params: resolvedParams });
}
