// scripts/update-roles.js
import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Starting role update...");

  // Update Network AMC (from old vendor role)
  const networkUpdate = await prisma.user.updateMany({
    where: {
      role: "network_vendor",
    },
    data: {
      role: "network_amc",
    },
  });
  console.log(
    `Updated ${networkUpdate.count} 'network_vendor' user(s) to 'network_amc'.`
  );

  // Update Biometric AMC (from old vendor role)
  const biometricUpdate = await prisma.user.updateMany({
    where: {
      role: "biometric_vendor",
    },
    data: {
      role: "biometric_amc",
    },
  });
  console.log(
    `Updated ${biometricUpdate.count} 'biometric_vendor' user(s) to 'biometric_amc'.`
  );

  console.log("Role update complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
