import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schemas";

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();
export const db = drizzle(client, { schema });
