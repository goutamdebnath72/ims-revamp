import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { editAuditComment } from "@/lib/incident-repo";

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: entryId } = await params;
    const { newComment } = await request.json();

     if (!entryId || typeof newComment === 'undefined') {
      return NextResponse.json({ error: 'Missing ID or comment text' }, { status: 400 });
    }

    const updatedEntry = await editAuditComment(entryId, newComment);
    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error("Failed to edit comment:", error);
    return NextResponse.json(
      { error: "Failed to edit comment" },
      { status: 500 }
    );
  }
}
