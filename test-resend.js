// In test-resend.js
require("dotenv").config({ path: "./.env.local" });
const { Resend } = require("resend");

// This immediately checks if the key was loaded from your .env.local file
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error("ERROR: RESEND_API_KEY was not found in your .env.local file.");
  process.exit(1);
}

const resend = new Resend(apiKey);

async function runTest() {
  try {
    const data = await resend.emails.send({
      from: process.env.SENDER_EMAIL,
      to: "delivered@resend.dev", // This is Resend's special test address
      subject: "IMS App - Standalone Test",
      html: "<strong>This proves the connection to Resend is working.</strong>",
    });
  } catch (error) {
    console.error("--- ERROR! ---");
    console.error("The Resend API call failed. This is the root cause.");
    console.error(error);
  }
}

runTest();
