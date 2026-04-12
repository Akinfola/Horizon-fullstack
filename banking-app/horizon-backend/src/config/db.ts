import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err) => {
  if (err) {
    console.error("❌ DB Connection failed:", err);
  } else {
    console.log("✅ Database connected successfully!");
  }
});

export const db = drizzle(pool, { schema });
export default db;