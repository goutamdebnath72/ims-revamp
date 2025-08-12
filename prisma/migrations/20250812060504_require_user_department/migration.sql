/*
  Warnings:

  - Made the column `designation` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "designation" SET NOT NULL;
