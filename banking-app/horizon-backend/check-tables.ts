import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

async function checkTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("📊 Tables in database:");
    res.rows.forEach(row => console.log(`- ${row.table_name}`));
    
    if (res.rows.length > 0) {
      console.log("✅ Tables are present!");
    } else {
      console.log("⚠️ Database is still empty.");
    }
    await pool.end();
  } catch (err) {
    console.error("❌ Failed to query tables:", err);
  }
}

checkTables();
