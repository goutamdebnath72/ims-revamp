-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_departmentId_fkey";

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "departmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
