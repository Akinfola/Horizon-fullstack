import { db } from "./src/config/db";
import { users } from "./src/config/schema";
import { eq } from "drizzle-orm";

async function checkSSN() {
  const ssn = "4536";
  const user = await db.select().from(users).where(eq(users.ssn, ssn)).limit(1);
  console.log(JSON.stringify(user, null, 2));
  process.exit(0);
}

checkSSN();
