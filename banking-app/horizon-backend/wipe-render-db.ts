import { db } from "./src/config/db";
import { users } from "./src/config/schema";
import { ne } from "drizzle-orm";

async function clearRenderUsers() {
  console.log("⚠️  Connecting to Render database... Deleting all non-admin users and their data...");

  try {
    const deleted = await db
      .delete(users)
      .where(ne(users.role, "admin"))
      .returning({ email: users.email, name: users.firstName });

    if (deleted.length === 0) {
      console.log("ℹ️  No users found to delete.");
    } else {
      deleted.forEach((u) => console.log(`🗑️  Deleted: ${u.name} (${u.email})`));
      console.log(`\n✅  Done. ${deleted.length} user(s) deleted from Render DB.`);
    }
  } catch (err: any) {
    console.error("❌  Error connecting to or modifying database:", err.message);
  }

  process.exit(0);
}

clearRenderUsers();
