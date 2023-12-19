import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

export const client = createClient({
  url: process.env.TURSO_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client);

try {
  await migrate(db, {
    migrationsFolder: 'migrations',
  });
  console.log('Tables migrated!');
} catch (error) {
  console.error('Error performing migration:', error);
}
