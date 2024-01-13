import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const socialAttendees = sqliteTable("social_attendees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  discord: text("discord").notNull(),
  socialEventId: integer("social_event_id").references(() => socialEvent.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});

export const socialEvent = sqliteTable("social_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
});

export const socialEventRelations = relations(socialEvent, ({ many }) => {
  return {
    attendees: many(socialAttendees),
  };
});
