// In prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { citusers as MOCK_USER_DB } from "../lib/citusers.js";
import { departments as DEPARTMENTS } from "../lib/departments.js";
import { incidentTypes as INCIDENT_TYPES } from "../lib/incident-types.js";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log("🌱 Starting seed process...");

  // 1. Seed Departments
  console.log("Seeding Departments...");
  await prisma.department.createMany({
    data: DEPARTMENTS.map((d) => ({
      code: parseInt(d.code, 10),
      name: d.name,
    })),
    skipDuplicates: true,
  });

  // 2. Seed Incident Types
  console.log("Seeding Incident Types...");
  await prisma.incidentType.createMany({
    data: INCIDENT_TYPES.map((name) => ({ name })),
    skipDuplicates: true,
  });

  // 3. Get a map of all departments for easy lookup
  const allDepartments = await prisma.department.findMany();
  const departmentMap = new Map(allDepartments.map((d) => [d.code, d.id]));

  // 4. Seed Users
  console.log(`Upserting users (with bcrypt hashing)...`);
  for (const key in MOCK_USER_DB) {
    const u = MOCK_USER_DB[key];
    const departmentId = departmentMap.get(parseInt(u.departmentCode, 10));

    if (!departmentId) {
      console.warn(
        `---> Warning: Could not find department with code ${u.departmentCode} for user: '${u.name}'. This user will be skipped.`
      );
      continue;
    }

    const passwordPlain = String(u.password ?? u.ticketNo);
    const hashedPassword = await bcrypt.hash(passwordPlain, SALT_ROUNDS);

    const userData = {
      name: u.name,
      ticketNo: String(u.ticketNo),
      password: hashedPassword,
      role: u.role || "standard",
      sailPNo: u.sailPNo ?? null,
      designation: u.designation ?? "N/A",
      essUserId: String(u.ticketNo),
      contactNo: u.mobileNo ?? null,
      emailId: u.emailSail ?? null,
      emailIdNic: u.emailNic ?? null,
      departmentId: departmentId,
    };

    await prisma.user.upsert({
      where: { ticketNo: String(u.ticketNo) },
      update: userData,
      create: userData,
    });
  }

  console.log("✅ Seeding complete.");
}

main()
  .catch(async (e) => {
    console.error("❌ Error during seed process:", e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
