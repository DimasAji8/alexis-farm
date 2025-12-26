import { NextRequest } from "next/server";

import { UsersController } from "./index";

export async function GET() {
  return UsersController.getAll();
}

export async function POST(req: NextRequest) {
  return UsersController.create(req);
}
