import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * A single libSQL connection per process. Locally this is an SQLite file
 * (`data/atlas.db`); in production DATABASE_URL can point at a libSQL/Turso
 * server without any code changes.
 */
export const DEFAULT_DATABASE_URL = "file:data/atlas.db";

type Db = LibSQLDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  __atlasClient?: Client;
  __atlasDb?: Db;
  __atlasPragmas?: Promise<unknown>;
};

export function getClient(): Client {
  if (!globalForDb.__atlasClient) {
    const client = createClient({
      url: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
    globalForDb.__atlasClient = client;
    // Cascading deletes rely on foreign keys being enforced.
    globalForDb.__atlasPragmas = client.execute("PRAGMA foreign_keys = ON").catch(() => undefined);
  }
  return globalForDb.__atlasClient;
}

export function getDb(): Db {
  if (!globalForDb.__atlasDb) {
    globalForDb.__atlasDb = drizzle(getClient(), { schema });
  }
  return globalForDb.__atlasDb;
}

/** Await connection set-up (pragmas). Cheap after the first call. */
export async function ready(): Promise<Db> {
  const db = getDb();
  await globalForDb.__atlasPragmas;
  return db;
}

export { schema };
