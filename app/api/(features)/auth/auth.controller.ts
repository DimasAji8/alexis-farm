import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { AuthService } from "./auth.service";
import { registerSchema } from "./auth.validation";

export class AuthController {
  static async register(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = registerSchema.parse(body);
      const user = await AuthService.register(validated);

      return apiResponse(user, "User berhasil dibuat", 201);
    } catch (error) {
      return apiError(error);
    }
  }
}
