// In app/api/users/[ticketNo]/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const { ticketno: ticketNo } = params; //Next.js automatically converts the names of dynamic route folders (like your [ticketNo] folder) to all lowercase when they are passed into our code.
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
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
