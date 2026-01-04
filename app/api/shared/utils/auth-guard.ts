import { getCurrentUserId } from "./current-user";
import { ApiError, ForbiddenError, UnauthorizedError } from "./errors";

export async function requireAuth() {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new UnauthorizedError();
  }
  return userId;
}

export async function getCurrentUser() {
  const session = await import("@/app/api/(features)/auth").then((m) => m.auth());
  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }
  return session.user;
}

export async function requireRole(allowed: string[]) {
  const session = await import("@/app/api/(features)/auth").then((m) => m.auth());
  const role = session?.user?.role;
  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }
  if (!allowed.includes(role ?? "")) {
    throw new ForbiddenError();
  }
  return session.user.id;
}
