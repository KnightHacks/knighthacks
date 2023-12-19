import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schemas';

export function connect(url: string, authToken: string) {
  const client = createClient({
    url,
    authToken,
  });

  return drizzle(client, { schema });
}

export * from 'drizzle-orm';
export * from './schemas';
