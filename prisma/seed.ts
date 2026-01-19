import "dotenv/config";

import { prisma } from "../app/api/db/prisma";
import { hashPassword } from "../app/api/shared/utils/password";

async function main() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminUsername = "admin";
  const adminName = "Administrator";

  if (!adminPassword) {
    throw new Error("SEED_ADMIN_PASSWORD belum di-set");
  }

  const hashedPassword = await hashPassword(adminPassword);

  await prisma.user.upsert({
    where: { username: adminUsername },
    update: {
      name: adminName,
      password: hashedPassword,
      role: "super_user",
      isActive: true,
    },
    create: {
      username: adminUsername,
      name: adminName,
      password: hashedPassword,
      role: "super_user",
      isActive: true,
    },
  });

  console.log("✅ Seed selesai: admin user siap dipakai");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
