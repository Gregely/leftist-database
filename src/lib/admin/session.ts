/**
 * Admin session tokens: "<expiry>.<hmac>" signed with HMAC-SHA256 (Web Crypto,
 * so this works in the proxy as well as in server actions).
 *
 * Configuration:
 *   ADMIN_PASSWORD         required in production (admin is disabled without it)
 *   ADMIN_SESSION_SECRET   signing secret; falls back to a value derived from the password
 * In development the password defaults to "atlas".
 */
export const SESSION_COOKIE = "atlas_admin";
const SESSION_HOURS = 12;
const DEV_PASSWORD = "atlas";

export function adminPassword(): string | null {
  const p = process.env.ADMIN_PASSWORD;
  if (p) return p;
  return process.env.NODE_ENV === "production" ? null : DEV_PASSWORD;
}

function secret(): string | null {
  const pw = adminPassword();
  if (!pw) return null;
  return process.env.ADMIN_SESSION_SECRET || `atlas-session:${pw}`;
}

async function hmac(message: string, key: string): Promise<string> {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(): Promise<{ token: string; maxAge: number } | null> {
  const s = secret();
  if (!s) return null;
  const expiry = Date.now() + SESSION_HOURS * 3600_000;
  return { token: `${expiry}.${await hmac(String(expiry), s)}`, maxAge: SESSION_HOURS * 3600 };
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  const s = secret();
  if (!s || !token) return false;
  const [expiry, sig] = token.split(".");
  if (!expiry || !sig || Number(expiry) < Date.now()) return false;
  return safeEqual(sig, await hmac(expiry, s));
}

export async function checkPassword(input: string): Promise<boolean> {
  const pw = adminPassword();
  if (!pw) return false;
  // Compare digests so timing does not depend on the password's content.
  const [a, b] = await Promise.all([hmac(input, "atlas-compare"), hmac(pw, "atlas-compare")]);
  return safeEqual(a, b);
}
