import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import {
  APPLICATION_STATUSES,
  GRADUATION_YEARS,
  MAJORS,
  SCHOOLS,
  SHIRT_SIZES,
  SPONSOR_TIERS,
} from "@knighthacks/consts";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // This will be generated from Clerk
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
});

// A user can make multiple hacker applications and have one metadata entry
export const usersRelations = relations(users, ({ many, one }) => {
  return {
    hackers: many(hackers),
    profile: one(userProfiles),
  };
});

export const userProfiles = sqliteTable("user_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .references(() => users.id, {
      onDelete: "cascade", // If the user is deleted, delete the metadata
      onUpdate: "cascade", // If the user is updated, update the metadata
    })
    .notNull(),
  isMember: integer("is_member", { mode: "boolean" }).default(false), // Whether or not they are a dues paying member
  phone: text("phone").notNull().unique(),
  age: integer("age").notNull(),
  shirtSize: text("shirt_size", {
    enum: SHIRT_SIZES,
  }).notNull(),
  major: text("major", { enum: MAJORS }).notNull(),
  school: text("school", { enum: SCHOOLS }).notNull(),
  gradYear: text("grad_year", {
    enum: GRADUATION_YEARS,
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
});

export const userProfileRelations = relations(userProfiles, ({ one }) => {
  return {
    user: one(users, {
      fields: [userProfiles.userId],
      references: [users.id],
    }),
  };
});

export const hackers = sqliteTable("hackers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .references(() => users.id, {
      onDelete: "cascade", // If the user is deleted, delete the hacker
      onUpdate: "cascade", // If the user is updated, update the hacker
    })
    .notNull(),
  hackathonId: integer("hackathon_id")
    .references(() => hackathons.id, {
      onDelete: "cascade", // If the hackathon is deleted, delete the hacker
      onUpdate: "cascade", // If the hackathon is updated, update the hacker
    })
    .notNull(),
  status: text("status", {
    enum: APPLICATION_STATUSES,
  })
    .default("applied")
    .notNull(),
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
    hackathon: one(hackathons, {
      fields: [hackers.hackathonId],
      references: [hackathons.id],
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

export const hackathonsRelations = relations(hackathons, ({ many }) => {
  return {
    hackers: many(hackers),
    sponsors: many(sponsors),
  };
});

export const sponsors = sqliteTable("sponsors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  website: text("website").notNull(),
  tier: text("tier", { enum: SPONSOR_TIERS }).notNull(),
  hackathonId: integer("hackathon_id").references(() => hackathons.id, {
    onDelete: "cascade", // If the hackathon is deleted, delete the hacker
    onUpdate: "cascade", // If the hackathon is updated, update the hacker
  }),
});

export const sponsorsRelations = relations(sponsors, ({ one }) => {
  return {
    hackathon: one(hackathons, {
      fields: [sponsors.hackathonId],
      references: [hackathons.id],
    }),
  };
});
