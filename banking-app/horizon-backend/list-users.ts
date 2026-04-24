import { db } from "./src/config/db";
import { users } from "./src/config/schema";

async function listUsers() {
  const allUsers = await db.select().from(users);
  console.log(JSON.stringify(allUsers, null, 2));
  process.exit(0);
}

listUsers();
