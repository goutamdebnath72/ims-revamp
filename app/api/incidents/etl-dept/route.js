import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getEtlIncidents } from "@/lib/incident-repo-prisma";
import { USER_ROLES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== USER_ROLES.ETL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const filters = Object.fromEntries(searchParams.entries());
    const incidents = await getEtlIncidents(filters);
    return NextResponse.json(incidents);
  } catch (error) {
    console.error("Failed in GET /api/incidents/etl-dept:", error);
    return NextResponse.json(
      { error: "Failed to fetch incidents" },
      { status: 500 }
    );
  }
}
