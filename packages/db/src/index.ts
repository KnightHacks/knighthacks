import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

export function buildDatabaseClient(url: string, authToken?: string) {
  const client = createClient({
    url,
    authToken,
  });

  return drizzle(client, { schema });
}

export * from "drizzle-orm/sql";
