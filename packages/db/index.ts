import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schemas";

export function db() {
  const client = postgres(process.env.DATABASE_URL!, {
    prepare: false,
  });

  return drizzle(client, { schema });
}
