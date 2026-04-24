import { db } from "./src/config/db";
import { users } from "./src/config/schema";
import { eq } from "drizzle-orm";

async function main() {
  const action = process.argv[2]; // 'check', 'verify', or 'delete'
  const email = process.argv[3];

  if (!action || !email) {
    console.log("Usage: npx ts-node manage-user.ts [check|verify|delete] [email]");
    process.exit(1);
  }

  try {
    switch (action) {
      case "check": {
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!user) {
          console.log(`❌ User ${email} not found.`);
        } else {
          console.log(JSON.stringify(user, null, 2));
        }
        break;
      }
      case "verify": {
        await db.update(users)
          .set({ isVerified: true, verificationToken: null, verificationTokenExpiry: null })
          .where(eq(users.email, email));
        console.log(`✅ User ${email} has been manually verified.`);
        break;
      }
      case "delete": {
        await db.delete(users).where(eq(users.email, email));
        console.log(`🗑️ User ${email} has been deleted.`);
        break;
      }
      default:
        console.log("Unknown action. Use check, verify, or delete.");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    process.exit(0);
  }
}

main();
