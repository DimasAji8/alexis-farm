import { NextRequest } from "next/server";

import { UsersController } from "../index";

type Params = { params: { id: string } };

export const DELETE = (req: NextRequest, context: Params) =>
  UsersController.delete(req, context);
