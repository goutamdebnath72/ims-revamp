import { PrismaClient } from '@prisma/client';
// 1. Import the Accelerate extension
import { withAccelerate } from '@prisma/extension-accelerate';

const globalForPrisma = global;

// 2. Wrap the new PrismaClient with the .$extends(withAccelerate())
const prisma = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;