// Applies SQL migrations in supabase/migrations to the database referenced by
// SUPABASE_DB_URL. Run with: npm run db:push
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  try {
    const envPath = join(__dirname, "..", ".env.local");
    const raw = readFileSync(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // .env.local is optional if vars already exist in the environment.
  }
}

async function main() {
  loadEnvLocal();

  const connectionString = process.env.SUPABASE_DB_URL;
  if (!connectionString || connectionString.includes("YOUR_PROJECT_REF")) {
    console.error(
      "\n[db:push] SUPABASE_DB_URL is not set. Add it to .env.local (see .env.local.example).\n"
    );
    process.exit(1);
  }

  const migrationsDir = join(__dirname, "..", "supabase", "migrations");
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("[db:push] Connected to database.");

  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    process.stdout.write(`[db:push] Applying ${file} ... `);
    await client.query(sql);
    console.log("done");
  }

  await client.end();
  console.log("[db:push] All migrations applied successfully.\n");
}

main().catch((err) => {
  console.error("\n[db:push] Migration failed:", err.message, "\n");
  process.exit(1);
});
