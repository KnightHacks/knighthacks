import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schemas";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set");
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

console.log("Connecting to ", process.env.DATABASE_URL);
await client.connect();
console.log("Connected!");
export const db = drizzle(client, { schema });
