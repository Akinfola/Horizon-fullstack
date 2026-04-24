import { db } from "./src/config/db";
import { users } from "./src/config/schema";
import bcrypt from "bcryptjs";
import crypto from "crypto";

async function createTestUser() {
  const email = "test@gmail.com";
  const hashedPassword = await bcrypt.hash("Password123!", 12);
  const verificationToken = "test-token-123";
  const verificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

  await db.insert(users).values({
    firstName: "Test",
    lastName: "User",
    email: email,
    password: hashedPassword,
    isVerified: false,
    verificationToken,
    verificationTokenExpiry,
  });

  console.log(`✅ Test user created: ${email}`);
  console.log(`Verification Token: ${verificationToken}`);
  process.exit(0);
}

createTestUser();
