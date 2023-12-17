import { relations } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { majors } from "../lib/majors";
import { schools } from "../lib/schools";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  isMember: integer("is_member", { mode: "boolean" }), // Whether or not they are a dues paying member
  email: text("email").notNull().unique(), // This will be from the oauth provider
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull().unique(),
  age: integer("age").notNull(),
  shirtSize: text("shirt_size", {
    enum: ["SM", "MD", "LG", "XL", "XXL"],
  }).notNull(),
  major: text("major", { enum: majors }).notNull(),
  school: text("school", { enum: schools }).notNull(),
  gradYear: text("grad_year", {
    enum: ["2024", "2025", "2026", "2027", "2028", "other"],
  }).notNull(),
  address1: text("address1").notNull(),
  address2: text("address2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  country: text("country").notNull(),
  github: text("github"),
  personalWebsite: text("personal_website"),
  linkedin: text("linkedin"),
  resume: text("resume"), // Link to resume
  oauthProvider: text("oauth_provider", {
    enum: ["google", "github"],
  }).notNull(),
  oauthUserId: text("oauth_id").notNull(), // We will use this to check if they've created a KnightHacks account
});

// A user can make multiple hacker applications
export const usersRelations = relations(users, ({ many }) => {
  return {
    hackers: many(hackers),
  };
});

export const hackers = sqliteTable("hackers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade", // If the user is deleted, delete the hacker
    onUpdate: "cascade", // If the user is updated, update the hacker
  }),
  hackathonId: integer("hackathon_id").references(() => hackathons.id, {
    onDelete: "cascade", // If the hackathon is deleted, delete the hacker
    onUpdate: "cascade", // If the hackathon is updated, update the hacker
  }),
  status: text("status", {
    enum: ["applied", "accepted", "waitlisted", "checkedin"],
  }).default("applied"),
  whyAttend: text("why_attend").notNull(),
  whatLearn: text("what_learn").notNull(),
});

// Hackers can only have one user
export const hackersRelations = relations(hackers, ({ one }) => {
  return {
    user: one(users, {
      fields: [hackers.userId],
      references: [users.id],
    }),
  };
});

export const hackathons = sqliteTable("hackathons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  theme: text("theme"),
});

// Hackathons can have multiple sponsors
export const hackathonsRelations = relations(hackathons, ({ many }) => {
  return {
    sponsors: many(sponsors),
  };
});

export const sponsors = sqliteTable("sponsors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  website: text("website").notNull(),
  tier: text("tier", { enum: ["gold", "silver", "bronze", "other"] }).notNull(),
  hackathonId: integer("hackathon_id").references(() => hackathons.id, {
    onDelete: "cascade", // If the hackathon is deleted, delete the hacker
    onUpdate: "cascade", // If the hackathon is updated, update the hacker
  }),
});

// Sponsors can sponsor multiple hackathons
export const sponsorsRelations = relations(sponsors, ({ many }) => {
  return {
    hackathons: many(hackathons),
  };
});

/*
 * The following are the schemas that will be used for the API
 * These are generated from the above schemas
 */

export const insertSponsorSchema = createInsertSchema(sponsors);
export const selectSponsorSchema = createSelectSchema(sponsors);

export const insertHackathonSchema = createInsertSchema(hackathons);
export const selectHackathonSchema = createSelectSchema(hackathons);

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertHackerSchema = createInsertSchema(hackers);
export const selectHackerSchema = createSelectSchema(hackers);
