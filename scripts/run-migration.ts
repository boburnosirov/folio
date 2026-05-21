/**
 * Runs any SQL migration file against the Supabase project.
 * Usage: npm run migrate -- supabase/migrations/003_fix_covers.sql
 *
 * Requires DATABASE_URL in .env.local:
 *   DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
 *
 * Get the URL from: Supabase Dashboard → Settings → Database → Connection string → URI (Transaction mode)
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

const file = process.argv[2];
if (!file) {
  console.error("\n❌  No file specified");
  console.error("   Usage: npm run migrate -- supabase/migrations/003_fix_covers.sql\n");
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Client } = require("pg");

async function migrate() {
  const filePath = join(process.cwd(), file);
  console.log(`\n📄  Running: ${file}`);

  const sql = readFileSync(filePath, "utf8");
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("✅  Connected to database");

  // Execute the whole file as one transaction
  try {
    await client.query(sql);
    console.log(`\n✅  Migration done: ${file}\n`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\n❌  Error: ${msg}\n`);
    await client.end();
    process.exit(1);
  }

  await client.end();
}

migrate().catch((err) => { console.error(err); process.exit(1); });
