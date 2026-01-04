import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { UsersService } from "./users.service";
import { createUserSchema, changePasswordSchema } from "./users.validation";

function extractId(req: NextRequest, params?: { id?: string }) {
  const fromParams = params?.id;
  if (fromParams) return fromParams;

  const last = req.nextUrl.pathname.split("/").pop();
  if (last) return last;

  throw new Error("Parameter id wajib diisi");
}

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

  static async changePassword(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = changePasswordSchema.parse(body);
      const data = await UsersService.changePassword(validated);
      return apiResponse(data, "Password berhasil diubah");
    } catch (error) {
      return apiError(error);
    }
  }

  static async delete(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const id = extractId(_req, params);
      const data = await UsersService.delete(id);
      return apiResponse(data, "User berhasil dihapus");
    } catch (error) {
      return apiError(error, "User tidak ditemukan", 404);
    }
  }
}
