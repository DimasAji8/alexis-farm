import { NextRequest } from "next/server";

import { AuthController } from "../index";

export const POST = (req: NextRequest) => AuthController.register(req);
