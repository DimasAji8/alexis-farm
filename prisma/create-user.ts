import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      name: "Administrator",
      password: hashedPassword,
      role: "super_user",
      isActive: true,
    },
  });
  
  console.log("✅ User created: admin / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
