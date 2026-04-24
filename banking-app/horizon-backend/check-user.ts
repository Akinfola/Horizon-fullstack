import { db } from "./src/config/db";
import { users } from "./src/config/schema";
import { eq } from "drizzle-orm";

async function checkUser() {
  const email = process.argv[2];
  if (!email) {
    console.log("Usage: npx ts-node check-user.ts [email]");
    process.exit(1);
  }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    console.log(`❌ User ${email} not found.`);
  } else {
    console.log(JSON.stringify(user, null, 2));
  }
  process.exit(0);
}

checkUser();
