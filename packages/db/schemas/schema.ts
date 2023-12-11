import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";

const hackersTable = mysqlTable("hackers", {
  id: int("id").primaryKey().autoincrement(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  resume: varchar("resume", { length: 1000 }),
  address1: varchar("address1", { length: 100 }),
  address2: varchar("address2", { length: 100 }),
});
