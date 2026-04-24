import { db } from "./src/config/db";
import { users } from "./src/config/schema";
import { eq } from "drizzle-orm";

async function verifyUser() {
  const email = process.argv[2];
  if (!email) {
    console.log("Usage: npx ts-node verify-user.ts [email]");
    process.exit(1);
  }

  await db.update(users)
    .set({ isVerified: true, verificationToken: null, verificationTokenExpiry: null })
    .where(eq(users.email, email));
  console.log(`✅ User ${email} has been manually verified.`);
  process.exit(0);
}

verifyUser();
