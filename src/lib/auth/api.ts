import "server-only";
import { NextResponse } from "next/server";
import type { Actor } from "@/lib/editorial/permissions";
import { getCurrentUser } from "./session";

/** For desk route handlers: the signed-in user, or a 401 response. */
export async function apiUser(): Promise<Actor | NextResponse> {
  const user = await getCurrentUser();
  return user ?? NextResponse.json({ error: "Sign in required" }, { status: 401 });
}
