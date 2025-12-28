import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { PemakaianPakanService } from "./pemakaian.service";
import { createPemakaianPakanSchema } from "./pemakaian.validation";

export class PemakaianPakanController {
  static async getAll() {
    try {
      const data = await PemakaianPakanService.getAll();
      return apiResponse(data, "Pemakaian pakan berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }

  static async create(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = createPemakaianPakanSchema.parse(body);
      const data = await PemakaianPakanService.create(validated);
      return apiResponse(data, "Pemakaian pakan berhasil dicatat", 201);
    } catch (error) {
      return apiError(error);
    }
  }

  static async update(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const id = params.id;
      if (!id) {
        throw new Error("Parameter id wajib diisi");
      }
      const body = await req.json();
      const validated = createPemakaianPakanSchema.partial().parse(body);
      const data = await PemakaianPakanService.update(id, validated);
      return apiResponse(data, "Pemakaian pakan berhasil diperbarui");
    } catch (error) {
      return apiError(error);
    }
  }
}
