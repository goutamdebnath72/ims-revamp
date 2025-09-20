// scripts/update-amc-names.js
import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting AMC name update...');

  // Update Network AMC name
  const networkUpdate = await prisma.user.updateMany({
    where: {
      role: 'network_amc', // Find users with the new role
    },
    data: {
      name: 'Network AMC', // Set the correct display name
    },
  });
  console.log(`Updated name for ${networkUpdate.count} 'network_amc' user(s).`);

  // Update Biometric AMC name
  const biometricUpdate = await prisma.user.updateMany({
    where: {
      role: 'biometric_amc', // Find users with the new role
    },
    data: {
      name: 'Biometric AMC', // Set the correct display name
    },
  });
  console.log(`Updated name for ${biometricUpdate.count} 'biometric_amc' user(s).`);

  console.log('Name update complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });