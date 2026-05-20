/**
 * Runs 001_initial_schema.sql against the Supabase project.
 * Splits on statement boundaries and executes via pg (direct Postgres).
 *
 * Requires DATABASE_URL in .env.local:
 *   DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
 *
 * Get the URL from: Supabase dashboard → Settings → Database → Connection string → URI
 */

import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("\n❌  DATABASE_URL not set in .env.local");
  console.error("   Go to: Supabase Dashboard → Settings → Database → URI\n");
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Client } = require("pg");

async function migrate() {
  const sql = readFileSync(
    join(process.cwd(), "supabase/migrations/001_initial_schema.sql"),
    "utf8"
  );

  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("✅  Connected to database");

  // Split on semicolons at top-level (skip empty)
  const statements = sql
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  let ok = 0;
  for (const stmt of statements) {
    try {
      await client.query(stmt);
      ok++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("already exists")) {
        console.log(`   ⚠️  skipped (already exists)`);
      } else {
        console.error(`   ❌  ${msg.slice(0, 120)}`);
      }
    }
  }

  await client.end();
  console.log(`\n✅  Migration done — ${ok}/${statements.length} statements\n`);
}

migrate().catch((err) => { console.error(err); process.exit(1); });
