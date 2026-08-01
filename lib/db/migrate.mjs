import pg from "pg";

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

console.log("Creating journal_entries table...");

await client.query(`
  CREATE TABLE IF NOT EXISTS journal_entries (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    mood TEXT NOT NULL DEFAULT 'happy',
    color TEXT NOT NULL DEFAULT 'blush',
    tags TEXT[] NOT NULL DEFAULT '{}',
    image_url TEXT,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
  );
`);

console.log("✅ journal_entries table created successfully!");

await client.end();
