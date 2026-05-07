import { db } from "./src/config/db";
import * as schema from "./src/config/schema";

async function initializeDatabase() {
  console.log("🚀 Initializing database schema...");
  try {
    // This isn't strictly "pushing" like the CLI, but we can use it to verify connection
    // and let our app's internal logic handle the rest.
    // However, the best way on Render is to just let the app start
    // and we'll ensure the connection is solid.
    
    await db.execute(require('drizzle-orm').sql`SELECT 1`);
    console.log("✅ Database connection verified!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
}

initializeDatabase();
