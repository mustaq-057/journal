const { Client } = require('pg');
const fs = require('fs');

async function main() {
  const env = fs.readFileSync('../../.env', 'utf8');
  const dbUrlLine = env.split('\n').find(l => l.startsWith('DATABASE_URL'));
  let url = dbUrlLine.split('=')[1].trim();
  url = url.replace(/^"|"$/g, '');

  const client = new Client({ connectionString: url });
  await client.connect();
  
  try {
    await client.query('ALTER TABLE journal_entries ADD COLUMN audio_url text;');
    console.log('success');
  } catch (e) {
    if (e.code === '42701') {
      console.log('Column already exists');
    } else {
      console.error(e);
      process.exit(1);
    }
  } finally {
    await client.end();
  }
}

main();
