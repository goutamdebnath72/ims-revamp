// In hash-checker.js
import bcrypt from "bcryptjs";

// The password for your admin account
const plainTextPassword = "D111086";
const SALT_ROUNDS = 10;

async function generateHash() {
  console.log(`Hashing the password: "${plainTextPassword}"...`);
  try {
    const hashedPassword = await bcrypt.hash(plainTextPassword, SALT_ROUNDS);
    console.log("\n✅ Hashing Complete!");
    console.log("------------------------------------------------------------");
    console.log("Copy this hash and compare it to the one in your database:");
    console.log(hashedPassword);
    console.log("------------------------------------------------------------");
  } catch (error) {
    console.error("❌ Hashing failed:", error);
  }
}

generateHash();