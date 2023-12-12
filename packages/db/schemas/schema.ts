import { relations } from "drizzle-orm";
import { pgTable, varchar, boolean, serial } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  address1: varchar("address1", { length: 100 }),
  address2: varchar("address2", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 100 }),
  city: varchar("city", { length: 100 }),
  shirtSize: varchar("shirt_size", { length: 100 }),
  personalWebsite: varchar("personal_website", { length: 100 }),
  github: varchar("github", { length: 100 }),
  linkedin: varchar("linkedin", { length: 100 }),
  resume: varchar("resume", { length: 1000 }),
  isMember: boolean("is_member"),
  isAdmin: boolean("is_admin"),
});

export const usersRelations = relations(users, ({ many }) => {
  return {
    hackathons: many(hackathons),
    hackers: many(hackers),
  };
});

export const hackers = pgTable("hackers", {
  id: serial("id").primaryKey(),
  userId: serial("user_id"),
  hackathonId: serial("hackathon_id"),
  isConfirmed: boolean("is_confirmed"),
  isWaitlisted: boolean("is_waitlisted"),
  isRejected: boolean("is_rejected"),
  isCheckedin: boolean("is_checkedin"),
  whyAttend: varchar("why_attend", { length: 1000 }),
  whatLearn: varchar("what_learn", { length: 1000 }),
});

export const hackathons = pgTable("hackathons", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  startDate: varchar("start_date", { length: 100 }),
  endDate: varchar("end_date", { length: 100 }),
  theme: varchar("theme", { length: 100 }),
});

export const sponsors = pgTable("sponsors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  logo: varchar("logo", { length: 100 }),
  website: varchar("website", { length: 100 }),
  tier: varchar("tier", { length: 100 }),
});
