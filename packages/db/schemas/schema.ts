import { serial, pgTable, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("serial"),
  username: text("username"),
  password: text("password"),
  email: text("email"),
});
