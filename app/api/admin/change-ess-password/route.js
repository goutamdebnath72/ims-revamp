import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Resend } from "resend";
import PasswordResetNotification from "@/emails/PasswordResetNotification";

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
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { adminPassword, targetTicketNo, incidentId } = await request.json();

    // 2. Validate input
    if (!adminPassword || !targetTicketNo || !incidentId) {
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

    // 4. Find the target user whose password will be reset
    const targetUser = await prisma.user.findUnique({
      where: { ticketNo: targetTicketNo },
    });
    if (!targetUser) {
      return NextResponse.json(
        { error: `Employee with Ticket No ${targetTicketNo} not found.` },
        { status: 404 }
      );
    }

    // 5. Hash the new default password and update the target user
    const newDefaultPassword = "dsp123";
    const hashedNewPassword = await bcrypt.hash(newDefaultPassword, 10);
    await prisma.user.update({
      where: { id: targetUser.id },
      data: { password: hashedNewPassword },
    });

    const spacing = "&nbsp;&nbsp;&nbsp;";
    const comment = `ESS Password for user ${targetUser.name} (${targetUser.ticketNo}) was reset to the default value.\n**ID : ${targetUser.ticketNo} ;${spacing}Password : ${newDefaultPassword}**`;

    // 6. Create the audit trail entry for this action
    await prisma.auditEntry.create({
      data: {
        incidentId: incidentId,
        author: adminUser.name,
        action: "Password Reset",
        comment: comment,
      },
    });

    // --- NEW EMAIL SENDING BLOCK BELOW ---
    // 7. Sends security notification email
    /*try {
          let recipientEmail = null;
          
          // Case 1: User is an Executive (Ticket No starts with '4')
          if (targetUser.ticketNo.startsWith('4')) {
            // Use their official @sail.in address if it's valid
            if (targetUser.emailSail && targetUser.emailSail.includes('@')) {
              recipientEmail = targetUser.emailSail;
            }
          } 
          // Case 2: User is a Non-Executive
          else {
            // Use their personal email (assuming it's in the emailNic field) if it's valid
            if (targetUser.emailNic && targetUser.emailNic.includes('@')) {
              recipientEmail = targetUser.emailNic;
            }
          }

          // Case 3: Only send the email if a valid recipient address was found
          if (recipientEmail) {
            await resend.emails.send({
              from: 'IMS Alert <rakesh.ojha@saildsp.co.in>',
              to: recipientEmail,
              subject: `Security Alert: Your ESS Password Has Been Reset (Incident: ${incidentId})`,
              react: <PasswordResetNotification
                userName={targetUser.name}
                incidentId={incidentId}
                adminName={adminUser.name}
              />,
            });
            console.log(`Password reset notification sent to ${recipientEmail}`);
          } else {
            console.log(`No valid email found for user ${targetUser.ticketNo}. Skipping notification.`);
          }

        } catch (emailError) {
          // Log the email error but do not fail the overall API request,
          // as the primary action (password reset) was successful.
          console.error("Failed to send notification email:", emailError);
        }*/
    // --- END OF NEW EMAIL BLOCK ---

    // 8. Return success
    return NextResponse.json({
      message: `Password successfully changed for ${targetUser.name}`,
    });
  } catch (error) {
    console.error("Error in /api/admin/change-ess-password:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
