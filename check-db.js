// check-db.js
import { PrismaClient } from '@prisma/client';

// This needs to load the .env.local file just like your seed script
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function check() {
  try {
    //console.log("Checking for departments...");
    const departmentCount = await prisma.department.count();
    //console.log(`✅ Success! Found ${departmentCount} departments.`);

    //console.log("Checking for users...");
    const userCount = await prisma.user.count();
    //console.log(`✅ Success! Found ${userCount} users.`);
  } catch (e) {
    console.error("❌ Error checking the database:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
check();