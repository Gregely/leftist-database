import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { ready } from "@/lib/db/client";
import { sessions, users } from "@/lib/db/schema";
import type { Role } from "@/lib/content/model";
import type { Actor } from "@/lib/editorial/permissions";

/**
 * Database-backed sessions. The cookie holds a random token; the database
 * holds only its SHA-256, so a leaked database cannot be replayed as cookies.
 * Deactivating a user or signing out invalidates sessions immediately.
 */
export const SESSION_COOKIE = "atlas_session";
const SESSION_DAYS = 7;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string): Promise<void> {
  const db = await ready();
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 86400_000);
  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt: expires.toISOString() });
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date().toISOString()));
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    const db = await ready();
    await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  }
  jar.delete(SESSION_COOKIE);
}

/** The signed-in, active user for this request (memoised per request). */
export const getCurrentUser = cache(async (): Promise<Actor | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = await ready();
  const row = await db
    .select({ id: users.id, role: users.role, name: users.name, email: users.email })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, hashToken(token)), gt(sessions.expiresAt, new Date().toISOString()), eq(users.active, true)))
    .get();
  return row ? { ...row, role: row.role as Role } : null;
});

/** For pages: redirect to sign-in when there is no session. */
export async function requireUser(): Promise<Actor> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}
