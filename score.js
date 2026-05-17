export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-key');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const geminiKey = req.headers['x-gemini-key'];
  if (!geminiKey) return res.status(400).json({ error: 'Χωρίς key' });

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Χωρίς κείμενο' });

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Δώσε ΜΟΝΟ έναν αριθμό 0-100 που δείχνει πόσο AI-like είναι αυτό το κείμενο. 0=αμιγώς ανθρώπινο, 100=αμιγώς AI. Μόνο τον αριθμό:\n\n${text.substring(0, 1400)}` }] }],
          generationConfig: { maxOutputTokens: 10, temperature: 0.1 }
        })
      }
    );
    const data = await r.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '50';
    const num = parseInt(raw.match(/\d+/)?.[0] || '50');
    return res.status(200).json({ score: isNaN(num) ? 50 : Math.min(100, Math.max(0, num)) });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
