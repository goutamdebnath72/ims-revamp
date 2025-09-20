// scripts/finalize-amc-migration.js
import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting final AMC data migration...');

  try {
    // Find and update the old Network Vendor user
    await prisma.user.update({
      where: {
        ticketNo: 'network.vendor', // Find by the OLD login ID
      },
      data: {
        ticketNo: 'network.amc', // UPDATE the login ID
        name: 'Network AMC',     // UPDATE the name
        role: 'network_amc',     // ENSURE the role is correct
      },
    });
    console.log('✅ Successfully updated network.vendor to network.amc.');
  } catch (error) {
    console.log('ℹ️ Could not find user with login ID "network.vendor". It may have already been updated. Skipping.');
  }
  
  try {
    // Find and update the old Biometric Vendor user
    await prisma.user.update({
      where: {
        ticketNo: 'biometric.vendor', // Find by the OLD login ID
      },
      data: {
        ticketNo: 'biometric.amc',   // UPDATE the login ID
        name: 'Biometric AMC',       // UPDATE the name
        role: 'biometric_amc',       // ENSURE the role is correct
      },
    });
    console.log('✅ Successfully updated biometric.vendor to biometric.amc.');
  } catch (error) {
    console.log('ℹ️ Could not find user with login ID "biometric.vendor". It may have already been updated. Skipping.');
  }

  console.log('Final migration complete.');
}

main()
  .catch((e) => {
    console.error('An error occurred during the final migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });