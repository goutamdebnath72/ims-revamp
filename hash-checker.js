// In hash-checker.js
import bcrypt from "bcryptjs";

// The password for your admin account
const plainTextPassword = "D111086";
const SALT_ROUNDS = 10;

async function generateHash() {
  try {
    const hashedPassword = await bcrypt.hash(plainTextPassword, SALT_ROUNDS);
  } catch (error) {
    console.error("❌ Hashing failed:", error);
  }
}

generateHash();
