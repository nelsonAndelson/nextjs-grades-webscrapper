// Creates the table and seed rows: `npm run db:setup` (reads DATABASE_URL from .env.local).
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set (add it to .env.local).");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const statements = readFileSync(new URL("./schema.sql", import.meta.url), "utf8")
  .split(/;\s*$/m)
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
}

const [{ count }] = await sql`SELECT count(*)::int AS count FROM student_profiles`;
console.log(`Database ready: student_profiles has ${count} rows.`);
