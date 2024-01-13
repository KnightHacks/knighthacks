import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const socialAttendees = sqliteTable("social_attendees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  discord: text("discord").notNull(),
});

export const socialAttendeesRelations = relations(
  socialAttendees,
  ({ many }) => ({
    socialAttendeesToSocialEvents: many(socialAttendeesToSocialEvents),
  }),
);

export const socialEvents = sqliteTable("social_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  points: integer("points").notNull(),
  secret: text("secret").notNull().unique(),
});

export const socialEventsRelations = relations(socialAttendees, ({ many }) => ({
  socialAttendeesToSocialEvents: many(socialAttendeesToSocialEvents),
}));

export const socialAttendeesToSocialEvents = sqliteTable(
  "social_attendee_events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    attendeeId: integer("attendee_id")
      .notNull()
      .references(() => socialAttendees.id),
    eventId: integer("event_id")
      .notNull()
      .references(() => socialEvents.id),
  },
);

export const socialAttendeesToSocialEventsRelations = relations(
  socialAttendeesToSocialEvents,
  ({ one }) => ({
    socialAttendees: one(socialAttendees, {
      fields: [socialAttendeesToSocialEvents.attendeeId],
      references: [socialAttendees.id],
    }),
    socialEvents: one(socialEvents, {
      fields: [socialAttendeesToSocialEvents.eventId],
      references: [socialEvents.id],
    }),
  }),
);
