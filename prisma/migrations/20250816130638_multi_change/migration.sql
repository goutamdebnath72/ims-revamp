-- AlterTable
ALTER TABLE "public"."incidents" ADD COLUMN     "assignedTeam" TEXT NOT NULL DEFAULT 'C&IT',
ADD COLUMN     "etlTasks" TEXT[],
ADD COLUMN     "telecomTasks" TEXT[];