import "server-only";
import { asc, eq, sql } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import { auditLog, entities, sessions, users } from "@/lib/db/schema";
import { ROLES, type Role } from "@/lib/content/model";
import { newId } from "@/lib/util/id";
import { hashPassword, passwordProblem, verifyPassword } from "./password";

export class UserError extends Error {}

const normaliseEmail = (e: string) => e.trim().toLowerCase();

export async function authenticate(email: string, password: string) {
  const db = await ready();
  const user = await db.select().from(users).where(eq(users.email, normaliseEmail(email))).get();
  // Verify against a dummy hash when the user is unknown so timing does not reveal accounts.
  const ok = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok || !user.active) return null;
  await db.update(users).set({ lastLoginAt: new Date().toISOString() }).where(eq(users.id, user.id));
  return user;
}
const DUMMY_HASH = "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";

export async function createUser(input: { email: string; name: string; role: Role; password: string }) {
  const email = normaliseEmail(input.email);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new UserError("Enter a valid email address.");
  if (!input.name.trim()) throw new UserError("Enter a name.");
  if (!ROLES.includes(input.role)) throw new UserError("Choose a role.");
  const problem = passwordProblem(input.password);
  if (problem) throw new UserError(problem);
  const db = await ready();
  const exists = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).get();
  if (exists) throw new UserError("A user with this email already exists.");
  const id = newId("usr");
  await db.insert(users).values({ id, email, name: input.name.trim(), role: input.role, passwordHash: await hashPassword(input.password) });
  return id;
}

export async function listUsers() {
  const db = await ready();
  return db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      active: users.active,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
      entries: sql<number>`(SELECT count(*) FROM entities e WHERE e.author_id = users.id)`,
      actions: sql<number>`(SELECT count(*) FROM audit_log a WHERE a.actor_id = users.id)`,
    })
    .from(users)
    .orderBy(asc(users.name));
}

export async function getUser(id: string) {
  const db = await ready();
  return (await db.select().from(users).where(eq(users.id, id)).get()) ?? null;
}

export async function setRole(id: string, role: Role) {
  if (!ROLES.includes(role)) throw new UserError("Unknown role.");
  const db = await ready();
  await db.update(users).set({ role, updatedAt: sql`(CURRENT_TIMESTAMP)` }).where(eq(users.id, id));
}

export async function setActive(id: string, active: boolean) {
  const db = await ready();
  await db.update(users).set({ active, updatedAt: sql`(CURRENT_TIMESTAMP)` }).where(eq(users.id, id));
  if (!active) await db.delete(sessions).where(eq(sessions.userId, id));
}

export async function setPassword(id: string, password: string) {
  const problem = passwordProblem(password);
  if (problem) throw new UserError(problem);
  const db = await ready();
  await db.update(users).set({ passwordHash: await hashPassword(password), updatedAt: sql`(CURRENT_TIMESTAMP)` }).where(eq(users.id, id));
}

export async function changeOwnPassword(id: string, current: string, next: string) {
  const user = await getUser(id);
  if (!user || !(await verifyPassword(current, user.passwordHash))) throw new UserError("Your current password is not correct.");
  await setPassword(id, next);
}

export async function countAdmins() {
  const db = await ready();
  const r = await db.select({ n: sql<number>`count(*)` }).from(users).where(sql`${users.role} = 'admin' AND ${users.active} = 1`).get();
  return Number(r?.n ?? 0);
}

/** Display names for a set of user ids. */
export async function userNames(): Promise<Record<string, string>> {
  const db = await ready();
  const rows = await db.select({ id: users.id, name: users.name }).from(users);
  return Object.fromEntries(rows.map((r) => [r.id, r.name]));
}
