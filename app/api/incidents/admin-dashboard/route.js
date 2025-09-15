import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAdminDashboardIncidents } from "@/lib/incident-repo-prisma";
import { USER_ROLES } from "@/lib/constants";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== USER_ROLES.ADMIN &&
      session.user.role !== USER_ROLES.SYS_ADMIN)
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filters = Object.fromEntries(searchParams.entries());

  try {
    const incidents = await getAdminDashboardIncidents(filters, session.user);
    return NextResponse.json(incidents);
  } catch (error) {
    console.error("Failed to fetch admin dashboard incidents:", error);
    return NextResponse.json(
      { message: "Error fetching incidents", error: error.message },
      { status: 500 }
    );
  }
}
