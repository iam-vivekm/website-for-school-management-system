import "dotenv/config";
// Referenced from javascript_database integration
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import Database from 'better-sqlite3';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

let db;
if (process.env.NODE_ENV === 'development' && process.env.REPL_ID === 'local-dev') {
  // Use SQLite for local development
  const sqlite = new Database('./local.db');
  db = drizzleSqlite({ client: sqlite, schema });
} else {
  // Use PostgreSQL for production
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { db };
