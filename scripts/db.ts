/**
 * Database tasks:
 *   tsx scripts/db.ts migrate   apply migrations in ./drizzle
 *   tsx scripts/db.ts seed      load the sample records (empty database only)
 *   tsx scripts/db.ts reset     delete the local database, migrate and seed
 *   tsx scripts/db.ts ensure    migrate, and seed if the database is empty
 *   tsx scripts/db.ts reindex   rebuild the full-text search index
 */
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/libsql/migrator";
import { DEFAULT_DATABASE_URL, getClient, ready } from "../src/lib/db/client";
import { rebuildSearchIndex } from "../src/lib/db/search-index";
import { seedDatabase } from "../src/lib/seed";

const url = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
const localPath = url.startsWith("file:") ? url.slice("file:".length) : null;

async function isEmpty() {
  const db = await ready();
  const row = (await db.get(sql`SELECT count(*) AS n FROM entities`)) as { n: number };
  return Number(row.n) === 0;
}

async function run(task: string) {
  if (task === "reset") {
    if (!localPath) throw new Error("reset only works with a local file database");
    for (const suffix of ["", "-wal", "-shm", "-journal"]) rmSync(localPath + suffix, { force: true });
  }
  if (localPath) mkdirSync(localPath.split("/").slice(0, -1).join("/") || ".", { recursive: true });
  const firstRun = localPath ? !existsSync(localPath) : false;

  const db = await ready();
  if (task !== "reindex") {
    await migrate(db, { migrationsFolder: "drizzle" });
    if (firstRun || task === "reset") console.log(`Migrated ${url}`);
  }

  if (task === "seed") {
    if (!(await isEmpty())) {
      console.log("Database already has content; run `npm run db:reset` to start over.");
      return;
    }
    await seedDatabase(db);
  } else if (task === "reset" || (task === "ensure" && (await isEmpty()))) {
    await seedDatabase(db);
  } else if (task === "reindex") {
    console.log(`Indexed ${await rebuildSearchIndex(db)} entities.`);
  }
  getClient().close();
}

const task = process.argv[2] ?? "ensure";
if (!["migrate", "seed", "reset", "ensure", "reindex"].includes(task)) {
  console.error(`Unknown task "${task}"`);
  process.exit(1);
}
run(task).catch((err) => {
  console.error(err);
  process.exit(1);
});
