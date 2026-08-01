// Direct SQL migration via Neon HTTP API (avoids SSL issues with local pg driver)
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const envPath = path.resolve(__dirname, '../../.env');
    const env = fs.readFileSync(envPath, 'utf8');
    dbUrl = env.split('\n').find(l => l.startsWith('DATABASE_URL'))?.split('=')?.slice(1)?.join('=')?.trim()?.replace(/^"|"$/g, '');
  } catch (err) {
    console.error("No .env file found and DATABASE_URL is not set.");
  }
}

if (!dbUrl) {
  console.error("DATABASE_URL is required but not provided.");
  process.exit(1);
}

// Parse Neon URL
const url = new URL(dbUrl);
const user = url.username;
const pass = url.password;
const host = url.hostname;
const db = url.pathname.slice(1);

const sqlBody = JSON.stringify({ 
  query: "ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS audio_url text" 
});

const options = {
  hostname: host,
  port: 443,
  path: `/sql`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`,
    'Neon-Connection-String': dbUrl,
    'Content-Length': Buffer.byteLength(sqlBody)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => { console.log('Response:', data); });
});

req.on('error', console.error);
req.write(sqlBody);
req.end();
