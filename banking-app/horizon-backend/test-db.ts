import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

async function testConnection() {
  console.log("🔍 Testing connection to:", process.env.DATABASE_URL?.split('@')[1]);
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const client = await pool.connect();
    console.log("✅ Successfully connected to the database!");
    const res = await client.query('SELECT NOW()');
    console.log("🕒 Database time:", res.rows[0].now);
    client.release();
    await pool.end();
  } catch (err) {
    console.error("❌ Connection failed!");
    console.error(err);
  }
}

testConnection();
