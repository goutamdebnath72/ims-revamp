/*
  Warnings:

  - You are about to drop the `audit_entries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `departments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `incident_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `incidents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('New', 'Processed', 'Resolved', 'Closed', 'PENDING_TELECOM', 'PENDING_ETL');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('Low', 'Medium', 'High');

-- DropForeignKey
ALTER TABLE "public"."audit_entries" DROP CONSTRAINT "audit_entries_incidentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."incidents" DROP CONSTRAINT "incidents_incidentTypeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."incidents" DROP CONSTRAINT "incidents_requestorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_departmentId_fkey";

-- DropTable
DROP TABLE "public"."audit_entries";

-- DropTable
DROP TABLE "public"."departments";

-- DropTable
DROP TABLE "public"."incident_types";

-- DropTable
DROP TABLE "public"."incidents";

-- DropTable
DROP TABLE "public"."users";

-- CreateTable
CREATE TABLE "public"."Incident" (
    "id" TEXT NOT NULL,
    "reportedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedOn" TIMESTAMP(3),
    "closedOn" TIMESTAMP(3),
    "jobTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'New',
    "priority" "public"."Priority" NOT NULL DEFAULT 'Medium',
    "isTypeLocked" BOOLEAN NOT NULL DEFAULT false,
    "isPriorityLocked" BOOLEAN NOT NULL DEFAULT false,
    "assignedTeam" TEXT,
    "telecomTasks" TEXT[],
    "incidentTypeId" TEXT NOT NULL,
    "requestorId" TEXT NOT NULL,
    "affectedUserId" TEXT,
    "assignedToId" TEXT,
    "rating" INTEGER,
    "resolution" TEXT,
    "affectedTicketNo" TEXT,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "ticketNo" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'standard',
    "department" TEXT,
    "departmentCode" INTEGER,
    "designation" TEXT,
    "loginShift" TEXT,
    "mobileNo" TEXT,
    "emailNic" TEXT,
    "emailSail" TEXT,
    "sailPNo" TEXT,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditTrail" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "rating" INTEGER,
    "resolution" TEXT,

    CONSTRAINT "AuditTrail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IncidentType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IncidentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "section" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TeamAvailability" (
    "id" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "shift" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TeamAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_ticketNo_key" ON "public"."User"("ticketNo");

-- CreateIndex
CREATE UNIQUE INDEX "IncidentType_name_key" ON "public"."IncidentType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "public"."Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "public"."Department"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TeamAvailability_memberId_date_shift_key" ON "public"."TeamAvailability"("memberId", "date", "shift");

-- AddForeignKey
ALTER TABLE "public"."Incident" ADD CONSTRAINT "Incident_incidentTypeId_fkey" FOREIGN KEY ("incidentTypeId") REFERENCES "public"."IncidentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Incident" ADD CONSTRAINT "Incident_requestorId_fkey" FOREIGN KEY ("requestorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Incident" ADD CONSTRAINT "Incident_affectedUserId_fkey" FOREIGN KEY ("affectedUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Incident" ADD CONSTRAINT "Incident_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditTrail" ADD CONSTRAINT "AuditTrail_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "public"."Incident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditTrail" ADD CONSTRAINT "AuditTrail_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamAvailability" ADD CONSTRAINT "TeamAvailability_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
