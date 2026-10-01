/**
 * User administration from the command line (works before anyone can sign in).
 *
 *   npm run user:create -- --email ada@example.org --name "Ada" --role admin [--password …]
 *   npm run user:list
 *
 * Without --password a random one is generated and printed once.
 * Demo accounts for local development are created by `npm run dev`
 * (ATLAS_DEMO_USERS=1) — never in production.
 */
import { eq } from "drizzle-orm";
import { getClient, ready } from "../src/lib/db/client";
import { users } from "../src/lib/db/schema";
import { ROLES, type Role } from "../src/lib/content/model";
import { generatePassword, hashPassword, passwordProblem } from "../src/lib/auth/password";
import { newId } from "../src/lib/util/id";

export const DEMO_PASSWORD = "atlas-demo-2026";
export const DEMO_USERS: { email: string; name: string; role: Role }[] = [
  { email: "contributor@atlas.test", name: "Clara Contributor", role: "contributor" },
  { email: "reviewer@atlas.test", name: "Rafael Reviewer", role: "reviewer" },
  { email: "editor@atlas.test", name: "Edith Editor", role: "editor" },
  { email: "admin@atlas.test", name: "Ada Administrator", role: "admin" },
];

/** Create the demo accounts if missing. Refuses to run in production. */
export async function ensureDemoUsers(log = console.log) {
  if (process.env.NODE_ENV === "production") throw new Error("Demo users are never created in production.");
  const db = await ready();
  let created = 0;
  for (const u of DEMO_USERS) {
    const exists = await db.select({ id: users.id }).from(users).where(eq(users.email, u.email)).get();
    if (exists) continue;
    await db.insert(users).values({ id: newId("usr"), ...u, passwordHash: await hashPassword(DEMO_PASSWORD) });
    created++;
  }
  if (created) log(`Created ${created} demo users (password "${DEMO_PASSWORD}") — development only.`);
}

function arg(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const cmd = process.argv[2];
  const db = await ready();
  if (cmd === "create") {
    const email = arg("email")?.trim().toLowerCase();
    const name = arg("name")?.trim();
    const role = (arg("role") ?? "contributor") as Role;
    if (!email || !name || !ROLES.includes(role)) throw new Error("Usage: --email <email> --name <name> --role <contributor|reviewer|editor|admin>");
    const password = arg("password") ?? generatePassword();
    const problem = passwordProblem(password);
    if (problem) throw new Error(problem);
    if (await db.select().from(users).where(eq(users.email, email)).get()) throw new Error(`User ${email} already exists.`);
    await db.insert(users).values({ id: newId("usr"), email, name, role, passwordHash: await hashPassword(password) });
    console.log(`Created ${role} ${email}.`);
    if (!arg("password")) console.log(`Temporary password: ${password}`);
  } else if (cmd === "list") {
    for (const u of await db.select().from(users)) console.log(`${u.active ? " " : "x"} ${u.role.padEnd(12)} ${u.email}  ${u.name}`);
  } else if (cmd === "demo") {
    await ensureDemoUsers();
  } else {
    console.log("Commands: create, list, demo");
  }
  getClient().close();
}

if (process.argv[1]?.endsWith("users.ts")) {
  main().catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
}
