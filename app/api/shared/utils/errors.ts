export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Silahkan Login Terlebih Dahulu") {
    super(401, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Anda Tidak Memiliki Akses") {
    super(403, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Tidak Ditemukan") {
    super(404, message);
  }
}

export class ValidationError extends ApiError {
  constructor(message = "Terjadi Kesalahan Validasi") {
    super(400, message);
  }
}
