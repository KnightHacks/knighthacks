import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { gradYears, majors, schools, shirtSizes } from "../consts";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // This will be from the oauth provider
  email: text("email").notNull().unique(), // This will be from the oauth provider
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
});

// A user can make multiple hacker applications and have one metadata entry
export const usersRelations = relations(users, ({ many, one }) => {
  return {
    hackers: many(hackers),
    metadata: one(userMetadata),
  };
});

export const userMetadata = sqliteTable("user_metadata", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").references(() => users.id, {
    onDelete: "cascade", // If the user is deleted, delete the metadata
    onUpdate: "cascade", // If the user is updated, update the metadata
  }),
  isMember: integer("is_member", { mode: "boolean" }).default(false), // Whether or not they are a dues paying member
  phone: text("phone").notNull().unique(),
  age: integer("age").notNull(),
  shirtSize: text("shirt_size", {
    enum: shirtSizes,
  }).notNull(),
  major: text("major", { enum: majors }).notNull(),
  school: text("school", { enum: schools }).notNull(),
  gradYear: text("grad_year", {
    enum: gradYears,
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

export const hackers = sqliteTable("hackers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").references(() => users.id, {
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
  tier: text("tier", { enum: ["gold", "silver", "bronze", "other"] }).notNull(),
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

export const insertUserMetadataSchema = createInsertSchema(userMetadata, {
  phone: (schema) =>
    schema.phone
      .min(1, {
        message: "Phone number is required",
      })
      .regex(/^\d{10}$/, {
        message: "Phone number must be 10 digits",
      }),
  age: z.coerce.number().min(18, {
    message: "You must be at least 18 years old",
  }),
  shirtSize: z.enum(shirtSizes, {
    errorMap: () => ({ message: "Invalid shirt size" }),
  }),
  major: z.enum(majors, {
    errorMap: () => ({ message: "Invalid major" }),
  }),
  school: z.enum(schools, {
    errorMap: () => ({ message: "Invalid school" }),
  }),
  gradYear: z.enum(gradYears, {
    errorMap: () => ({ message: "Invalid graduation year" }),
  }),
  address1: (schema) =>
    schema.address1.min(1, {
      message: "Address is required",
    }),
  city: (schema) =>
    schema.city.min(1, {
      message: "City is required",
    }),
  state: (schema) =>
    schema.state.min(1, {
      message: "State is required",
    }),
  zip: (schema) =>
    schema.zip.min(1, {
      message: "Zip code is required",
    }),
  country: (schema) =>
    schema.country.min(1, {
      message: "Country is required",
    }),
  github: (schema) =>
    schema.github
      .url({
        message: "Invalid GitHub link",
      })
      .optional()
      .or(z.literal("")),
  personalWebsite: (schema) =>
    schema.personalWebsite
      .url({
        message: "Invalid personal website link",
      })
      .optional()
      .or(z.literal("")),
  linkedin: (schema) =>
    schema.linkedin
      .url({
        message: "Invalid LinkedIn link",
      })
      .optional()
      .or(z.literal("")),
});
export const selectUserMetadataSchema = createSelectSchema(userMetadata);

export const insertHackerSchema = createInsertSchema(hackers);
export const insertHackerRequestSchema = createInsertSchema(hackers, {
  whyAttend: (schema) =>
    schema.whyAttend.min(1, {
      message: "This field is required",
    }),
  whatLearn: (schema) =>
    schema.whatLearn.min(1, {
      message: "This field is required",
    }),
});
export const selectHackerSchema = createSelectSchema(hackers);
