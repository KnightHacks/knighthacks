import { relations } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name"),
  lastName: text("last_name"),
  name: text("name"),
  state: text("state"),
  school: text("school"),
  major: text("major"),
  gradYear: text("grad_year"),
  address1: text("address1"),
  address2: text("address2"),
  phone: text("phone", { length: 20 }),
  email: text("email"),
  city: text("city"),
  shirtSize: text("shirt_size"),
  personalWebsite: text("personal_website"),
  github: text("github"),
  linkedin: text("linkedin"),
  resume: text("resume"), // Link to resume
  isMember: integer("is_member", { mode: "boolean" }),
  isAdmin: integer("is_admin", { mode: "boolean" }),
  oauthProvider: text("oauth_provider", { enum: ["google", "github"] }),
  oauthId: text("oauth_id"),
  zip: text("zip"),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const usersRelations = relations(users, ({ many }) => {
  return {
    hackers: many(hackers),
  };
});

export const hackers = sqliteTable("hackers", {
  id: integer("id").primaryKey(),
  userId: integer("user_id"),
  hackathonId: integer("hackathon_id"),
  status: text("status", {
    enum: ["applied", "accepted", "waitlisted", "checkedin"],
  }),
  whyAttend: text("why_attend"),
  whatLearn: text("what_learn"),
});

export const insertHackerSchema = createInsertSchema(hackers);
export const selectHackerSchema = createSelectSchema(hackers);

export const hackersRelations = relations(hackers, ({ one }) => {
  return {
    user: one(users, {
      fields: [hackers.userId],
      references: [users.id],
    }),
  };
});

export const hackathons = sqliteTable("hackathons", {
  id: integer("id").primaryKey(),
  name: text("name"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  theme: text("theme"),
});

export const insertHackathonSchema = createInsertSchema(hackathons);
export const selectHackathonSchema = createSelectSchema(hackathons);

export const sponsors = sqliteTable("sponsors", {
  id: integer("id").primaryKey(),
  name: text("name"),
  logo: text("logo"),
  website: text("website"),
  tier: text("tier", { enum: ["gold", "silver", "bronze", "other"] }),
});

export const insertSponsorSchema = createInsertSchema(sponsors);
export const selectSponsorSchema = createSelectSchema(sponsors);
