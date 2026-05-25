import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

// In Node.js (local dev), we need the `ws` package as WebSocket adapter.
// On Vercel/Edge, WebSocket is available natively — no adapter needed.
if (typeof globalThis.WebSocket === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  neonConfig.webSocketConstructor = require("ws");
}

let _db: NeonDatabase<typeof schema> | null = null;

export function getDb() {
  if (!_db) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
    _db = drizzle(pool, { schema });
  }
  return _db;
}

// Default export for backward compatibility
export const db = new Proxy({} as NeonDatabase<typeof schema>, {
  get(_target, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
