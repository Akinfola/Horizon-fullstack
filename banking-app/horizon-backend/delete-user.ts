import { db } from "./src/config/db";
import { users } from "./src/config/schema";
import { eq } from "drizzle-orm";

async function deleteUser() {
  const email = process.argv[2];
  if (!email) {
    console.log("Usage: npx ts-node delete-user.ts [email]");
    process.exit(1);
  }

  await db.delete(users).where(eq(users.email, email));
  console.log(`🗑️ User ${email} has been deleted.`);
  process.exit(0);
}

deleteUser();
