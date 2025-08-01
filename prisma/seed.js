const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt"); // <-- ADDED: Import bcrypt
const { MOCK_USER_DB } = require("../lib/citusers");
const { departments } = require("../lib/departments");
const { incidentTypes } = require("../lib/incident-types");
const { DateTime } = require("luxon");

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Departments
  await prisma.department.createMany({
    data: departments.map((d) => ({ code: d.code, name: d.name })),
    skipDuplicates: true,
  });

  // 2. Seed Incident Types
  await prisma.incidentType.createMany({
    data: incidentTypes.map((name) => ({ name })),
    skipDuplicates: true,
  });

  console.log("Seeding users with hashed passwords...");

  // 3. Seed Users and link them to Departments
  for (const userData of Object.values(MOCK_USER_DB)) {
    const department = await prisma.department.findFirst({
      where: { name: userData.department },
    });
    if (department) {
      // --- START: Hashing Logic ---
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      // --- END: Hashing Logic ---

      await prisma.user.upsert({
        where: { ticketNo: userData.ticketNo },
        update: {},
        create: {
          role: userData.role,
          name: userData.name,
          password: hashedPassword, // <-- CHANGED: Use the hashed password
          ticketNo: userData.ticketNo,
          contactNo: userData.mobileNo,
          emailId: userData.emailSail,
          emailIdNic: userData.emailNic,
          sailPNo: userData.sailpno,
          departmentId: department.id,
        },
      });
    } else {
      console.warn(
        `Could not find department "${userData.department}" for user "${userData.name}". Skipping user.`
      );
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });