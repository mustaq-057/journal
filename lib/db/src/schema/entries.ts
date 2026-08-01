import { pgTable, text, bigint, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const entriesTable = pgTable("journal_entries", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull().default(""),
  body: text("body").notNull().default(""),
  mood: text("mood").notNull().default("happy"),
  color: text("color").notNull().default("blush"),
  tags: text("tags").array().notNull().default([]),
  imageUrl: text("image_url"),
  audioUrl: text("audio_url"),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
});

export const insertEntrySchema = createInsertSchema(entriesTable);
export const selectEntrySchema = createSelectSchema(entriesTable);

export type InsertEntry = z.infer<typeof insertEntrySchema>;
export type Entry = typeof entriesTable.$inferSelect;
