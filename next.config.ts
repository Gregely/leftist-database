import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the e2e suite run its own server alongside a dev server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // The phone dock fills the foot of the screen and search sits top right; keep the development badge clear of both.
  devIndicators: { position: "top-left" },
  // The libSQL client ships native bindings for local SQLite files; keep it out of the bundle.
  serverExternalPackages: ["@libsql/client", "libsql"],
  // Ship the local SQLite database with the server output (ignored when DATABASE_URL points at a remote libSQL/Turso instance).
  outputFileTracingIncludes: { "/**": ["./data/atlas.db"] },
};

export default nextConfig;
