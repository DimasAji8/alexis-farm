import bcrypt from "bcryptjs";

const DEFAULT_SALT_ROUNDS = 10;

export async function hashPassword(
  password: string,
  saltRounds: number = DEFAULT_SALT_ROUNDS,
): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}
