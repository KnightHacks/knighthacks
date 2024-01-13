import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const socialAttendees = sqliteTable("social_attendees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  discord: text("discord").notNull(),
  socialEventId: integer("social_event_id").references(() => socialEvents.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});

export const socialEvents = sqliteTable("social_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  points: integer("points").notNull(),
});

export const socialEventsRelations = relations(socialEvents, ({ many }) => {
  return {
    attendees: many(socialAttendees),
  };
});
