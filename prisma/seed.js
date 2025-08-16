// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { departments as DEPARTMENTS } from "../lib/departments.js";
import { incidentTypes as INCIDENT_TYPES } from "../lib/incident-types.js";
import { MOCK_USER_DB } from "../lib/citusers.js";
import { USER_ROLES } from "../lib/constants.js";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function seedDepartments() {
  // seed known list
  await prisma.department.createMany({
    data: DEPARTMENTS.map((d) => ({ code: d.code, name: d.name })),
    skipDuplicates: true,
  });

  // build lookups
  const all = await prisma.department.findMany();
  const byCode = new Map(all.map((d) => [d.code, d]));
  const byName = new Map(all.map((d) => [d.name.trim().toLowerCase(), d]));

  // ensure any dept referenced by users also exists
  const extra = [];
  const seen = new Set();
  for (const key of Object.keys(MOCK_USER_DB)) {
    const u = MOCK_USER_DB[key];
    const code = Number(u.departmentCode) || null;
    const name = (u.department || "").trim();
    const nameKey = name.toLowerCase();
    if (!name) continue;
    if (!byCode.has(code) && !byName.has(nameKey) && !seen.has(nameKey)) {
      extra.push({ code: code || 900000 + extra.length, name });
      seen.add(nameKey);
    }
  }
  if (extra.length)
    await prisma.department.createMany({ data: extra, skipDuplicates: true });

  // refresh
  const final = await prisma.department.findMany();
  return {
    byCode: new Map(final.map((d) => [d.code, d.id])),
    byName: new Map(final.map((d) => [d.name.trim().toLowerCase(), d.id])),
  };
}

async function seedIncidentTypes() {
  await prisma.incidentType.createMany({
    data: INCIDENT_TYPES.map((name) => ({ name })),
    skipDuplicates: true,
  });
}

function normalizeFromMock(u) {
  return {
    role: u.role || "standard",
    name: u.name,
    ticketNo: String(u.ticketNo),
    passwordPlain: String(u.password ?? u.ticketNo), // will hash below
    contactNo: u.mobileNo ?? null,
    emailId: u.emailSail ?? null,
    emailIdNic: u.emailNic ?? null,
    sailPNo: u.sailpno ?? null,
    deptCode: u.departmentCode ?? null,
    deptName: u.department ?? null,
  };
}

async function seedUsers({ byCode, byName }) {
  // 1) build list from MOCK_USER_DB
  const fromMock = Object.keys(MOCK_USER_DB).map((k) =>
    normalizeFromMock(MOCK_USER_DB[k])
  );

  // 2) add the extra standard user you requested
  fromMock.push({
    role: "standard",
    name: "Standard User",
    ticketNo: "111111",
    passwordPlain: "password",
    contactNo: null,
    emailId: null,
    emailIdNic: null,
    sailPNo: null,
    deptCode: 98540, // C & IT (TECH)
    deptName: "C & IT (TECH)",
  });

  fromMock.push(
    {
      role: USER_ROLES.TELECOM,
      name: "Telecom User",
      ticketNo: "telecom", // This will be their login username
      passwordPlain: "password", // Default password, will be hashed
      contactNo: null,
      emailId: null,
      emailIdNic: null,
      sailPNo: null,
      deptCode: 98540, // Assigning to C & IT (TECH)
      deptName: "C & IT (TECH)",
    },
    {
      role: USER_ROLES.ETL,
      name: "ETL User",
      ticketNo: "etl", // This will be their login username
      passwordPlain: "password", // Default password, will be hashed
      contactNo: null,
      emailId: null,
      emailIdNic: null,
      sailPNo: null,
      deptCode: 98540, // Assigning to C & IT (TECH)
      deptName: "C & IT (TECH)",
    }
  );

  for (const r of fromMock) {
    // resolve department
    let departmentId = null;
    if (r.deptCode && byCode.has(r.deptCode))
      departmentId = byCode.get(r.deptCode);
    else if (r.deptName) {
      const k = r.deptName.trim().toLowerCase();
      departmentId = byName.get(k);
    }
    if (!departmentId) {
      throw new Error(
        `No department found for ${r.name} (${r.ticketNo}); code=${r.deptCode} name=${r.deptName}`
      );
    }

    // hash the password like your snippet
    const hashedPassword = await bcrypt.hash(r.passwordPlain, SALT_ROUNDS);

    const data = {
      role: r.role,
      name: r.name,
      password: hashedPassword,
      ticketNo: r.ticketNo,
      essUserId: r.ticketNo, // as requested
      designation: "N/A", // fill later in Studio
      contactNo: r.contactNo,
      emailId: r.emailId,
      emailIdNic: r.emailIdNic,
      sailPNo: r.sailPNo,
      // This is the corrected syntax for linking a relation
      department: {
        connect: {
          id: departmentId,
        },
      },
    };

    await prisma.user.upsert({
      where: { ticketNo: data.ticketNo },
      update: data,
      create: data,
    });
  }
}

async function main() {
  console.log("Seeding Departments…");
  const maps = await seedDepartments();

  console.log("Seeding Incident Types…");
  await seedIncidentTypes();

  console.log("Seeding Users (with bcrypt)…");
  await seedUsers(maps);

  console.log("✅ Seeding complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
