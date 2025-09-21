// check-db.js
import { PrismaClient } from "@prisma/client";

// This needs to load the .env.local file just like your seed script
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function check() {
  try {
    const departmentCount = await prisma.department.count();
    const userCount = await prisma.user.count();
  } catch (e) {
    console.error("❌ Error checking the database:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
check();
