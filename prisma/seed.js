const { PrismaClient } = require('@prisma/client');
const { MOCK_USER_DB } = require('../lib/citusers');
const { departments } = require('../lib/departments');
const { incidentTypes } = require('../lib/incident-types');
// We no longer import the incidents.json file
// const incidentsJson = require('../incidents.json'); 
const { DateTime } = require('luxon');

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 1. Seed Departments
  console.log('Seeding departments...');
  await prisma.department.createMany({
    data: departments.map(d => ({ code: d.code, name: d.name })),
    skipDuplicates: true,
  });
  console.log('Departments seeded.');

  // 2. Seed Incident Types
  console.log('Seeding incident types...');
  await prisma.incidentType.createMany({
    data: incidentTypes.map(name => ({ name })),
    skipDuplicates: true,
  });
  console.log('Incident types seeded.');

  // 3. Seed Users and link them to Departments
  console.log('Seeding C&IT users...');
  for (const userData of Object.values(MOCK_USER_DB)) {
    const department = await prisma.department.findFirst({ where: { name: userData.department } });
    if (department) {
      await prisma.user.upsert({
        where: { ticketNo: userData.ticketNo },
        update: {},
        create: {
          role: userData.role,
          name: userData.name,
          password: userData.password,
          ticketNo: userData.ticketNo,
          contactNo: userData.mobileNo,
          emailId: userData.emailSail,
          emailIdNic: userData.emailNic,
          sailPNo: userData.sailpno,
          departmentId: department.id,
        },
      });
    } else {
      console.warn(`Could not find department "${userData.department}" for user "${userData.name}". Skipping user.`);
    }
  }
  console.log('Users seeded.');
  
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });