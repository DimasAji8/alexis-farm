import { NextRequest } from "next/server";

import { UsersController } from "./index";

export const GET = () => UsersController.getAll();
export const POST = (req: NextRequest) => UsersController.create(req);
