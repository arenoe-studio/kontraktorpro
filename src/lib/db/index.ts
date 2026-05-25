import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

// In Node.js (local dev), we need the `ws` package as WebSocket adapter.
// On Vercel/Edge, WebSocket is available natively — no adapter needed.
if (typeof globalThis.WebSocket === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  neonConfig.webSocketConstructor = require("ws");
}

function createDb() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  return drizzle(pool, { schema });
}

// Singleton — created on first use, not at module load time
let _db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}

// Re-export as `db` for all existing imports — calls getDb() lazily
export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
  has(_target, prop) {
    return Reflect.has(getDb(), prop);
  },
});
