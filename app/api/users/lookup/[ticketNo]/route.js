import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET a user by their ticket number for lookup
export async function GET(request, { params }) {
  const { ticketNo } = params;

  if (!ticketNo || ticketNo.length !== 6) {
    return NextResponse.json(
      { error: "A valid 6-digit ticket number is required." },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        ticketNo: ticketNo.trim(),
      },
      // IMPORTANT: Only select the data needed for the lookup for security.
      // Do not return the full user object with password hash, etc.
      select: {
        id: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(`Failed to lookup user ${ticketNo}:`, error);
    return NextResponse.json(
      { error: "Failed to lookup user" },
      { status: 500 }
    );
  }
}
