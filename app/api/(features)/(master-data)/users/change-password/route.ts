import { UsersController } from "../users.controller";

export async function POST(req: Request) {
  return UsersController.changePassword(req as never);
}
