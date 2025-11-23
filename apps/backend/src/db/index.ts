// This file initializes the database connection.
// It sets up the SQLite database using better-sqlite3 and drizzle-orm.
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database("sqlite.db");
const db = drizzle({ client: sqlite, schema });

export { db };
export * from "./schema";
