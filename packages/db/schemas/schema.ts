import { relations } from "drizzle-orm";
import {
  mysqlTable,
  int,
  varchar,
  mysqlEnum,
  date,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  address1: varchar("address1", { length: 100 }),
  address2: varchar("address2", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 100 }),
  city: varchar("city", { length: 100 }),
  shirtSize: mysqlEnum("shirt_size", ["XS", "S", "M", "L", "XL", "XXL"]),
  personalWebsite: varchar("personal_website", { length: 100 }),
  github: varchar("github", { length: 100 }),
  linkedin: varchar("linkedin", { length: 100 }),
  resume: varchar("resume", { length: 1000 }),
  isMember: int("is_member"),
});

export const usersRelations = relations(users, ({ many }) => {
  return {
    hackathons: many(hackathons),
    hackers: many(hackers),
  };
});

export const hackathons = mysqlTable("hackathons", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }),
  startDate: date("start_date"),
  endDate: date("end_date"),
  theme: varchar("theme", { length: 100 }),
});

export const hackers = mysqlTable("hackers", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id"),
  hackathonId: int("hackathon_id"),
  isConfirmed: int("is_confirmed"),
  isWaitlisted: int("is_waitlisted"),
  isRejected: int("is_rejected"),
  isCheckedin: int("is_checkedin"),
  whyAttend: varchar("why_attend", { length: 1000 }),
  whatLearn: varchar("what_learn", { length: 1000 }),
});

export const sponsors = mysqlTable("sponsors", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }),
  logo: varchar("logo", { length: 100 }),
  website: varchar("website", { length: 100 }),
  tier: mysqlEnum("tier", ["Bronze", "Silver", "Gold", "Platinum"]),
});
