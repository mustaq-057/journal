// Direct SQL migration via Neon HTTP API (avoids SSL issues with local pg driver)
import('node:https').then(({ default: https }) => {
  const fs = await import('node:fs');
  const env = fs.readFileSync('../../.env', 'utf8');
  const dbUrl = env.split('\n').find(l => l.startsWith('DATABASE_URL')).split('=').slice(1).join('=').trim().replace(/^"|"$/g, '');
  
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
});
