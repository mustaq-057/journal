import { Router } from "express";
import { db, entriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { z } from "zod";
import { randomUUID } from "node:crypto";

// Configure Cloudinary explicitly from CLOUDINARY_URL env var
if (process.env.CLOUDINARY_URL) {
  const url = new URL(process.env.CLOUDINARY_URL);
  cloudinary.config({
    cloud_name: url.hostname,
    api_key: url.username,
    api_secret: url.password,
    secure: true,
  });
}

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

// GET /api/entries — list all entries newest first
router.get("/entries", async (_req: any, res: any) => {
  try {
    const entries = await db
      .select()
      .from(entriesTable);

    // sort desc by createdAt
    entries.sort((a, b) => b.createdAt - a.createdAt);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

// GET /api/entries/:id
router.get("/entries/:id", async (req: any, res: any) => {
  try {
    const rows = await db
      .select()
      .from(entriesTable)
      .where(eq(entriesTable.id, req.params.id as string));

    if (rows.length === 0) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch entry" });
  }
});

const CreateEntrySchema = z.object({
  title: z.string().default(""),
  body: z.string().default(""),
  mood: z.string().default("happy"),
  color: z.string().default("blush"),
  tags: z.array(z.string()).default([]),
});

// POST /api/entries
router.post("/entries", async (req: any, res: any) => {
  try {
    const parsed = CreateEntrySchema.parse(req.body);
    const now = Date.now();
    const newEntry = {
      id: randomUUID(),
      ...parsed,
      imageUrl: null,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(entriesTable).values(newEntry);
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ error: "Invalid entry data" });
  }
});

// PATCH /api/entries/:id
router.patch("/entries/:id", async (req: any, res: any) => {
  try {
    const id = req.params.id as string;
    const updates = req.body as Record<string, unknown>;

    const rows = await db
      .select()
      .from(entriesTable)
      .where(eq(entriesTable.id, id));

    if (rows.length === 0) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }

    const updated = await db
      .update(entriesTable)
      .set({ ...updates, updatedAt: Date.now() })
      .where(eq(entriesTable.id, id))
      .returning();

    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update entry" });
  }
});

// DELETE /api/entries/:id
router.delete("/entries/:id", async (req: any, res: any) => {
  try {
    await db.delete(entriesTable).where(eq(entriesTable.id, req.params.id as string));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

// POST /api/entries/:id/image — upload image to Cloudinary
router.post(
  "/entries/:id/image",
  upload.single("image"),
  async (req: any, res: any) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file provided" });
        return;
      }

      const rows = await db
        .select()
        .from(entriesTable)
        .where(eq(entriesTable.id, req.params.id as string));

      if (rows.length === 0) {
        res.status(404).json({ error: "Entry not found" });
        return;
      }

      // Upload buffer to Cloudinary
      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "hello-kitty-journal",
            resource_type: "image",
            transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result as { secure_url: string });
          }
        );
        stream.end(req.file!.buffer);
      });

      // Parse existing images if any
      let currentImages: string[] = [];
      try {
        if (rows[0].imageUrl) {
          if (rows[0].imageUrl.startsWith('[')) {
            currentImages = JSON.parse(rows[0].imageUrl);
          } else {
            currentImages = [rows[0].imageUrl];
          }
        }
      } catch (e) {}

      currentImages.push(result.secure_url);

      const updated = await db
        .update(entriesTable)
        .set({ imageUrl: JSON.stringify(currentImages), updatedAt: Date.now() })
        .where(eq(entriesTable.id, req.params.id as string))
        .returning();

      res.json(updated[0]);
    } catch (err) {
      console.error("Image upload error:", err);
      res.status(500).json({ error: "Failed to upload image" });
    }
  }
);

// POST /api/entries/:id/audio — upload audio to Cloudinary
router.post(
  "/entries/:id/audio",
  upload.single("audio"),
  async (req: any, res: any) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file provided" });
        return;
      }

      const rows = await db
        .select()
        .from(entriesTable)
        .where(eq(entriesTable.id, req.params.id as string));

      if (rows.length === 0) {
        res.status(404).json({ error: "Entry not found" });
        return;
      }

      // Upload buffer to Cloudinary (use auto resource type to handle webm/ogg/mp4 audio)
      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "hello-kitty-journal/audio",
            resource_type: "auto",
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result as { secure_url: string });
          }
        );
        stream.end(req.file!.buffer);
      });

      // Parse existing audios if any
      let currentAudios: string[] = [];
      try {
        if (rows[0].audioUrl) {
          if (rows[0].audioUrl.startsWith('[')) {
            currentAudios = JSON.parse(rows[0].audioUrl);
          } else {
            currentAudios = [rows[0].audioUrl];
          }
        }
      } catch (e) {}

      currentAudios.push(result.secure_url);

      const updated = await db
        .update(entriesTable)
        .set({ audioUrl: JSON.stringify(currentAudios), updatedAt: Date.now() })
        .where(eq(entriesTable.id, req.params.id as string))
        .returning();

      res.json(updated[0]);
    } catch (err) {
      console.error("Audio upload error:", err);
      res.status(500).json({ error: "Failed to upload audio" });
    }
  }
);

export default router;
