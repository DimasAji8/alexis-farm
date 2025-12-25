import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { UsersService } from "./users.service";
import { createUserSchema } from "./users.validation";

export class UsersController {
  static async getAll() {
    try {
      const data = await UsersService.getAll();
      return apiResponse(data, "Daftar user berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }

  static async create(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = createUserSchema.parse(body);
      const data = await UsersService.create(validated);
      return apiResponse(data, "User berhasil dibuat", 201);
    } catch (error) {
      return apiError(error);
    }
  }

  static async delete(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const data = await UsersService.delete(params.id);
      return apiResponse(data, "User berhasil dihapus");
    } catch (error) {
      return apiError(error, "User tidak ditemukan", 404);
    }
  }
}
