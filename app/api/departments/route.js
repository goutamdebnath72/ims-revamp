import { NextResponse } from "next/server";
import { getAllDepartments } from "@/lib/incident-repo-prisma.js";

export async function GET() {
  console.log("\n--- API: /api/departments GET ---");
  console.log(`Timestamp: ${new Date().toISOString()}`);

  try {
    const departments = await getAllDepartments();
    console.log("SUCCESS: Fetched departments successfully.");
    return NextResponse.json(departments);
  } catch (error) {
    console.error("--- ERROR in /api/departments ---");
    console.error("Failed to fetch departments:", error.message);
    console.error("Full Error Object:", error);
    console.log("-------------------------------------");
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}
