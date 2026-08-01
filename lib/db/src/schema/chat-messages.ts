import { pgTable, text, bigint, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const chatMessagesTable = pgTable("kitty_chat_messages", {
  id: text("id").primaryKey().notNull(),
  role: text("role").notNull(), // 'user' | 'assistant'
  content: text("content").notNull(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessagesTable);
export const selectChatMessageSchema = createSelectSchema(chatMessagesTable);

export type InsertChatMessage = typeof chatMessagesTable.$inferInsert;
export type ChatMessage = typeof chatMessagesTable.$inferSelect;
