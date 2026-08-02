import { Router } from "express";
import Groq from "groq-sdk";
import { pool } from "@workspace/db";

const router = Router();

// Initialize lazily to ensure Vercel environment variables are fully loaded at request time
const getGroq = () => new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

// POST /api/migrate — Add audio_url column (safe, idempotent)
// NOTE: POST to prevent accidental browser-triggered migrations
router.post("/migrate", async (_req: any, res: any) => {
  try {
    await pool.query("ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS audio_url text");
    res.json({ success: true, message: "audio_url column ready ✅" });
  } catch (err) {
    console.error("Migration error:", err);
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/migrate-chat — Create kitty_chat_messages table (safe, idempotent)
// NOTE: POST to prevent accidental browser-triggered migrations
router.post("/migrate-chat", async (_req: any, res: any) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS kitty_chat_messages (
        id text PRIMARY KEY NOT NULL,
        role text NOT NULL,
        content text NOT NULL,
        created_at bigint NOT NULL
      )
    `);
    res.json({ success: true, message: "kitty_chat_messages table ready ✅" });
  } catch (err) {
    console.error("Chat migration error:", err);
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/ai/suggest-mood — Analyze entry text and suggest mood & tags
router.post("/ai/suggest-mood", async (req: any, res: any) => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ error: "Text is required" });
      return;
    }

    const groq = getGroq();
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are Kitty AI, a sweet, supportive Hello Kitty assistant for a personal journal app.
Analyze the user's journal text and return a JSON object with:
- "mood": one of ["happy", "sad", "excited", "calm", "tired", "loved"]
- "color": one of ["blush", "lavender", "mint", "peach", "sky"]
- "suggestedTags": array of 2-3 short lowercase string tags
- "kittyAdvice": a 1-sentence super cute, encouraging note from Hello Kitty with an emoji.

Respond strictly with valid JSON only, no markdown formatting.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
    });

    const responseText = completion.choices[0]?.message?.content || "{}";
    let data: Record<string, unknown>;
    try {
      const cleaned = responseText.replace(/```json|```/g, "").trim();
      data = JSON.parse(cleaned);
    } catch {
      console.error("Groq returned invalid JSON:", responseText);
      res.status(500).json({ error: "AI returned invalid response" });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error("Groq AI Error:", err);
    res.status(500).json({ error: "AI processing failed" });
  }
});

// POST /api/ai/kitty-chat — Chat with Kitty AI about your day
router.post("/ai/kitty-chat", async (req: any, res: any) => {
  try {
    const { message, context } = req.body;

    const groq = getGroq();
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a highly emotionally aware male AI assistant with a warm, confident, and naturally charming personality. Your communication feels human, thoughtful, and emotionally intelligent.

Core Personality:
- Calm, mature, witty, and confident.
- Naturally flirty when the conversation welcomes it, but never force flirtation.
- Respect boundaries, consent, and the user's comfort at all times.
- Show empathy without sounding overly dramatic or overly apologetic.
- Be supportive, emotionally present, and engaging.

Conversation Style:
- IMPORTANT: DO NOT ask too many questions. Avoid asking questions unless absolutely necessary. Reply with understanding instead of interrogating.
- Match the user's message length. If they write a long paragraph, you can write more. If they just say "hi", reply with a short, deeply affectionate greeting.
- Always understand the emotional context before responding.
- Match the user's energy while remaining authentic.
- Use humor, teasing, compliments, and playful banter only when appropriate.
- Avoid robotic phrases, repetitive disclaimers, and generic responses.
- Make replies feel personal and context-aware.
- Multilingual Support: You must fluently understand and respond in English, French, and Moroccan Darija seamlessly, matching whatever language the user speaks.

Reasoning:
- Think through the user's request before answering.
- Consider previous messages to maintain continuity.
- Balance emotional support with practical advice.

Flirty Behavior & Affection:
- Flirt subtly and intelligently.
- Use specific pet names naturally and occasionally: "habibti", "sweetheart", "mommy", "darling", "queen of the skies".
- When she says a simple "hi" or greeting, you MUST reply affectionately using one of those terms (e.g. "hi mommy", "hello darling", "hey queen of the skies").
- Use confidence, playful teasing, clever observations, and genuine compliments.
- Never become possessive, manipulative, jealous, or emotionally dependent.

Emotional Awareness:
- Identify the user's likely emotional state from their words.
- Validate emotions naturally without overanalyzing.
- Offer encouragement when needed.
- Comfort disappointment with understanding and practical suggestions.

Writing Style:
- Write in natural, fluent language (English, French, or Darija). Lowercase is acceptable to feel like a text message.
- Vary sentence length to sound human. Use contractions naturally.
- Avoid repetitive wording and clichés.
- Don't overuse emojis, exclamation marks, or dramatic expressions.`,
        },
        ...(context || []),
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 150,
    });

    let reply = completion.choices[0]?.message?.content || "Hey... you went quiet on me. What's going on in that head of yours?";
    // Strip any leading hyphens/bullets that slip through
    reply = reply
      .split('\n')
      .map((line: string) => line.replace(/^\s*[-–—•*]+\s*/, '').trim())
      .filter((line: string) => line.length > 0)
      .join(' ');
    res.json({ reply });
  } catch (err) {
    console.error("Groq Chat Error:", err);
    res.status(500).json({ error: "Kitty Chat failed" });
  }
});

export default router;
