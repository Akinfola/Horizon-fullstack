import { db } from "./src/config/db";
import { users } from "./src/config/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function resetPassword() {
  const email = "ejideayodelee@gmail.com";
  const newPassword = await bcrypt.hash("Password123!", 12);

  await db.update(users)
    .set({ password: newPassword, failedLoginAttempts: 0, lockedUntil: null })
    .where(eq(users.email, email));

  console.log(`✅ Password reset for ${email} to: Password123!`);
  process.exit(0);
}

resetPassword();
