import { db } from "./src/config/db";
import { users } from "./src/config/schema";

async function clearUsers() {
  console.log("⚠️ Deleting ALL users from the database...");
  try {
    await db.delete(users);
    console.log("✅ All users have been deleted. You can now use any email to register again.");
  } catch (error) {
    console.error("❌ Failed to clear users:", error);
  } finally {
    process.exit(0);
  }
}

clearUsers();
