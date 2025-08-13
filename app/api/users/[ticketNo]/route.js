// In app/api/users/[ticketNo]/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const { ticketNo } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { ticketNo },
      include: { department: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // We don't want to send the password hash to the client
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user due to a server error." },
      { status: 500 }
    );
  }
}
