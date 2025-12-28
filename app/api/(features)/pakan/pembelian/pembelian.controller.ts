import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { PembelianPakanService } from "./pembelian.service";
import { createPembelianPakanSchema } from "./pembelian.validation";

export class PembelianPakanController {
  static async getAll() {
    try {
      const data = await PembelianPakanService.getAll();
      return apiResponse(data, "Pembelian pakan berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }

  static async create(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = createPembelianPakanSchema.parse(body);
      const data = await PembelianPakanService.create(validated);
      return apiResponse(data, "Pembelian pakan berhasil dicatat", 201);
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
      const validated = createPembelianPakanSchema.partial().parse(body);
      const data = await PembelianPakanService.update(id, validated);
      return apiResponse(data, "Pembelian pakan berhasil diperbarui");
    } catch (error) {
      return apiError(error);
    }
  }
}
