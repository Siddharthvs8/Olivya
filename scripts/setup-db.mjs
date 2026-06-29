// One-time database setup for Vercel/Neon Postgres.
//   npm run db:setup
// Reads DATABASE_URL (or POSTGRES_URL) from .env.local and applies db/schema.sql.

import { neon } from "@neondatabase/serverless";
import { readFile } from "node:fs/promises";

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL;

if (!url) {
  console.error(
    "\n✗ No database URL found.\n" +
      "  Add DATABASE_URL (from Vercel → Storage → Neon) to .env.local, then re-run.\n",
  );
  process.exit(1);
}

const sql = neon(url);
const ddl = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");

// Run each statement individually (the Neon HTTP driver is one-statement-per-call).
const statements = ddl
  .split(";")
  .map((s) => s.replace(/--.*$/gm, "").trim())
  .filter(Boolean);

try {
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log(`\n✓ Database ready — applied ${statements.length} statements.\n`);
} catch (err) {
  console.error("\n✗ Setup failed:", err.message, "\n");
  process.exit(1);
}
