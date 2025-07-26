-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ticketNo" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "contactNo" TEXT,
    "emailId" TEXT,
    "emailIdNic" TEXT,
    "sailPNo" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "shiftDate" TIMESTAMP(3) NOT NULL,
    "incidentType" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "location" TEXT,
    "ipAddress" TEXT,
    "jobFrom" TEXT,
    "reportedOn" TEXT NOT NULL,
    "requestorId" TEXT NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_ticketNo_key" ON "User"("ticketNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_sailPNo_key" ON "User"("sailPNo");

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_requestorId_fkey" FOREIGN KEY ("requestorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
