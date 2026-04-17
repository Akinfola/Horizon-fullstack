import { db } from "../src/config/db";
import { users } from "../src/config/schema";
import { eq } from "drizzle-orm";

async function test() {
  try {
    console.log("Testing DB connection and query...");
    const result = await db.select().from(users).limit(1);
    console.log("Success! Query returned:", result.length, "rows");
    console.log("Columns in first row:", result[0] ? Object.keys(result[0]) : "N/A");
  } catch (error) {
    console.error("DB Test Failed:", error);
  } finally {
    process.exit();
  }
}

test();
