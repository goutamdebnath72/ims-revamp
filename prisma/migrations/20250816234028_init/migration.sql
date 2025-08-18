-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."departments" (
    "id" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."incident_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "incident_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ticketNo" TEXT NOT NULL,
    "essUserId" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "contactNo" TEXT,
    "emailId" TEXT,
    "emailIdNic" TEXT,
    "sailPNo" TEXT,
    "passwordLastChanged" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_entries" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" INTEGER,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "incidentId" TEXT NOT NULL,

    CONSTRAINT "audit_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."incidents" (
    "id" TEXT NOT NULL,
    "shiftDate" TIMESTAMP(3) NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "location" TEXT,
    "ipAddress" TEXT,
    "jobFrom" TEXT,
    "reportedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isTypeLocked" BOOLEAN,
    "isPriorityLocked" BOOLEAN,
    "affectedTicketNo" TEXT,
    "rating" INTEGER,
    "telecomTasks" TEXT[],
    "assignedTeam" TEXT NOT NULL DEFAULT 'C&IT',
    "etlTasks" TEXT[],
    "incidentTypeId" TEXT NOT NULL,
    "requestorId" TEXT NOT NULL,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_code_key" ON "public"."departments"("code");

-- CreateIndex
CREATE UNIQUE INDEX "incident_types_name_key" ON "public"."incident_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_ticketNo_key" ON "public"."users"("ticketNo");

-- CreateIndex
CREATE UNIQUE INDEX "users_essUserId_key" ON "public"."users"("essUserId");

-- CreateIndex
CREATE UNIQUE INDEX "users_sailPNo_key" ON "public"."users"("sailPNo");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_entries" ADD CONSTRAINT "audit_entries_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "public"."incidents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."incidents" ADD CONSTRAINT "incidents_incidentTypeId_fkey" FOREIGN KEY ("incidentTypeId") REFERENCES "public"."incident_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."incidents" ADD CONSTRAINT "incidents_requestorId_fkey" FOREIGN KEY ("requestorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
