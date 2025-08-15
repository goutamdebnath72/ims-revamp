import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Hr,
} from "@react-email/components";

export default function PasswordResetNotification({
  userName = "DSP Employee",
  incidentId = "Not specified",
  adminName = "An Administrator",
  contactPerson,
  contactMobile,
}) {
  const resetTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "long",
  });

  return (
    <Html>
      <Head />
      <Preview>Security Alert: Your ESS account password was reset</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
        <Container
          style={{
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
            border: "1px solid #ddd",
            padding: "20px",
          }}
        >
          <Heading as="h1" style={{ color: "#0056b3" }}>
            Security Alert
          </Heading>
          <Text>Dear {userName},</Text>
          <Text>
            This is a notification to inform you that the password for your
            Employee Self Service (ESS) account was successfully reset on{" "}
            <strong>{resetTime}</strong>.
          </Text>
          <Text>
            This action was performed by {adminName} in response to Incident No:{" "}
            <strong>{incidentId}</strong>.
          </Text>
          <Hr />
          <Text style={{ fontWeight: "bold" }}>What to do next:</Text>
          <ul style={{ paddingLeft: "20px" }}>
            <li>
              If you requested this change, please contact C & IT Helpdesk(PAX -
              42046) to receive your new temporary password.
            </li>
            <li>
              If you **did not** request this password change, please contact
              the C&IT Security In-charge, **{contactPerson}**, immediately at
              **{contactMobile}** to report this issue.
            </li>
          </ul>
          <Hr />
          <Text style={{ fontSize: "12px", color: "#777" }}>
            Thank you,
            <br />
            DSP C&IT Department
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
