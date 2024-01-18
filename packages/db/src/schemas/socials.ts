import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const attendees = sqliteTable("attendees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  discordId: text("discord_id").notNull().unique(),
  discordUsername: text("discord_username").unique(),
});

export const attendeesRelations = relations(attendees, ({ many }) => ({
  attendeesEvents: many(attendeesEvents),
}));

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  points: integer("points").notNull(),
  secret: text("secret").notNull().unique(),
});

export const eventsRelations = relations(attendees, ({ many }) => ({
  attendeesEvents: many(attendeesEvents),
}));

export const attendeesEvents = sqliteTable("attendees_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  attendeeId: integer("attendee_id")
    .notNull()
    .references(() => attendees.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const attendeesEventsRelations = relations(
  attendeesEvents,
  ({ one }) => ({
    attendees: one(attendees, {
      fields: [attendeesEvents.attendeeId],
      references: [attendees.id],
    }),
    events: one(events, {
      fields: [attendeesEvents.eventId],
      references: [events.id],
    }),
  }),
);
