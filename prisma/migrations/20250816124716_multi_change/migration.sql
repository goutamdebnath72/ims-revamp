-- DropForeignKey
ALTER TABLE "public"."Incident" DROP CONSTRAINT "Incident_requestorId_fkey";

-- AlterTable
ALTER TABLE "public"."incidents" ADD COLUMN     "assignedTeam" TEXT NOT NULL DEFAULT 'C&IT',
ADD COLUMN     "etlTasks" TEXT[],
ADD COLUMN     "telecomTasks" TEXT[];

-- DropTable
DROP TABLE "public"."Incident";

-- DropTable
DROP TABLE "public"."User";

