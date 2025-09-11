import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  // 1. Get the current admin's session
  const session = await getServerSession(authOptions);
  if (
    !session?.user ||
    (session.user.role !== "admin" && session.user.role !== "sys_admin")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adminUser = session.user;

  try {
    const { adminPassword, targetSailPNo, incidentId } = await request.json();

    // 2. Validate input
    if (!adminPassword || !targetSailPNo || !incidentId) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // 3. Re-authenticate the admin performing the action
    const adminFromDb = await prisma.user.findUnique({
      where: { id: adminUser.id },
    });
    const passwordMatch = await bcrypt.compare(
      adminPassword,
      adminFromDb.password
    );
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Admin authentication failed." },
        { status: 403 }
      );
    }

    // 4. Find the target user by SAIL P/No
    const targetUser = await prisma.user.findUnique({
      where: { sailPNo: targetSailPNo },
    });
    if (!targetUser) {
      return NextResponse.json(
        { error: `Employee with SAIL P/No ${targetSailPNo} not found.` },
        { status: 404 }
      );
    }

    // 5. MOCK ACTION: Generate a random temporary password
    const newDefaultPassword = "welcome123";
    const spacing = "&nbsp;&nbsp;&nbsp;";
    const comment = `SAP Password for user ${targetUser.name} (${targetUser.sailPNo}) was reset.\n**ID : ${targetUser.sailPNo} ;${spacing}New Password : ${newDefaultPassword}**`;

    // 6. Create the audit trail entry for this action
    await prisma.auditEntry.create({
      data: {
        incidentId: incidentId,
        author: adminUser.name,
        action: "SAP Password Reset",
        comment: comment,
      },
    });

    // 7. Return success
    return NextResponse.json({
      message: `SAP Password successfully reset for ${targetUser.name}`,
    });
  } catch (error) {
    console.error("Error in /api/admin/change-sap-password:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
