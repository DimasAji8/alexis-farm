import { NextRequest } from "next/server";

import { UsersController } from "../index";

type Params = { params: { id: string } };

export async function DELETE(req: NextRequest, { params }: Params) {
  return UsersController.delete(req, { params });
}
