export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-key');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const geminiKey = req.headers['x-gemini-key'];
  if (!geminiKey) return res.status(400).json({ error: 'Χωρίς Gemini key' });

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Χωρίς κείμενο' });

  const sample = text.substring(0, 1800);

  const prompts = [
    `Αξιολόγησε αν το κείμενο είναι γραμμένο από AI ή άνθρωπο. Δώσε ΜΟΝΟ JSON χωρίς backticks:\n{"score":<0-100>,"signals":["<σήμα1>","<σήμα2>","<σήμα3>"],"reason":"<1 πρόταση>"}\n\nΚείμενο:\n${sample}`,
    `Εξέτασε για AI χαρακτηριστικά: παθητική φωνή, ομοιόμορφες προτάσεις, τυπικές εκφράσεις. Δώσε ΜΟΝΟ JSON χωρίς backticks:\n{"score":<0-100>,"signals":["<χαρ1>","<χαρ2>","<χαρ3>"],"reason":"<1 πρόταση>"}\n\nΚείμενο:\n${sample}`,
    `Συγκρίνοντας με ανθρώπινο γραπτό, πόσο AI είναι αυτό; Κοίτα ρυθμό, λεξιλόγιο, φυσικότητα. Δώσε ΜΟΝΟ JSON χωρίς backticks:\n{"score":<0-100>,"signals":["<παρ1>","<παρ2>","<παρ3>"],"reason":"<1 πρόταση>"}\n\nΚείμενο:\n${sample}`,
  ];

  async function geminiCall(prompt) {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 300, temperature: 0.3 }
        })
      }
    );
    if (!r.ok) throw new Error(`Gemini error ${r.status}`);
    const d = await r.json();
    return d.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  try {
    const [r1, r2, r3] = await Promise.all(prompts.map(p => geminiCall(p)));
    const parse = raw => {
      try { return JSON.parse(raw.replace(/```json|```/g, '').trim()); }
      catch { return null; }
    };
    const results = [r1, r2, r3].map(parse).filter(Boolean);
    if (!results.length) throw new Error('parse fail');

    const avgScore = Math.round(results.reduce((s, j) => s + j.score, 0) / results.length);
    const allSignals = [...new Set(results.flatMap(j => j.signals || []))].slice(0, 4);
    const reason = results[0].reason || '';
    const verdict = avgScore >= 70 ? 'Πιθανώς AI' : avgScore >= 40 ? 'Μικτό ή AI-βοηθούμενο' : 'Πιθανώς ανθρώπινο';

    return res.status(200).json({
      ai_score: avgScore,
      verdict,
      reason,
      top_signals: allSignals,
      ensemble: results.map(j => j.score)
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
