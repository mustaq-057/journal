import { Router } from "express";
import { db, chatMessagesTable } from "@workspace/db";
import { randomUUID } from "node:crypto";

const router = Router();

// GET /api/chat — get all chat messages in order
router.get("/chat", async (_req: any, res: any) => {
  try {
    const messages = await db
      .select()
      .from(chatMessagesTable)
      .orderBy(chatMessagesTable.createdAt);
    res.json(messages);
  } catch (err) {
    console.error("Chat fetch error:", err);
    res.status(500).json({ error: "Failed to fetch chat messages" });
  }
});

// POST /api/chat — save a single message
router.post("/chat", async (req: any, res: any) => {
  try {
    const { role, content } = req.body;
    if (!role || !content) {
      res.status(400).json({ error: "role and content required" });
      return;
    }
    const msg = {
      id: randomUUID(),
      role: role as string,
      content: content as string,
      createdAt: Date.now(),
    };
    await db.insert(chatMessagesTable).values(msg);
    res.status(201).json(msg);
  } catch (err) {
    console.error("Chat save error:", err);
    res.status(500).json({ error: "Failed to save message" });
  }
});

// DELETE /api/chat — clear all chat history
router.delete("/chat", async (_req: any, res: any) => {
  try {
    await db.delete(chatMessagesTable);
    res.json({ success: true });
  } catch (err) {
    console.error("Chat clear error:", err);
    res.status(500).json({ error: "Failed to clear chat" });
  }
});

export default router;
