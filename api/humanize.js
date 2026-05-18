export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-key');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const geminiKey = req.headers['x-gemini-key'];
  if (!geminiKey) return res.status(400).json({ error: 'Χωρίς Gemini key' });

  const { sentences } = req.body;
  if (!sentences?.length) return res.status(400).json({ error: 'Χωρίς προτάσεις' });

  const numbered = sentences.map((s, i) => `[${i + 1}] ${s.trim()}`).join('\n');
  const prompt = `Ξέγραψε κάθε πρόταση ώστε να ακούγεται αυθεντικά ανθρώπινη.

ΑΥΣΤΗΡΟΙ ΚΑΝΟΝΕΣ:
- Επέστρεψε ΑΚΡΙΒΩΣ ${sentences.length} γραμμές με αρίθμηση [1],[2] κλπ
- ΜΗΝ συγχωνεύεις ή σπας προτάσεις — 1 μέσα, 1 έξω
- Κράτησε ΟΛΑ τα γεγονότα, αριθμούς, κύρια ονόματα
- Χρησιμοποίησε φυσικό, καθημερινό ύφος
- Ενεργητική φωνή: "η εταιρεία αποφάσισε" όχι "αποφασίστηκε"
- Ποίκιλε μήκος προτάσεων
- ΑΠΑΓΟΡΕΥΟΝΤΑΙ: αποτελεί, διαδραματίζει, εύρυθμη, εν κατακλείδι, ως εκ τούτου, θεμελιώδης, εν λόγω, αναδεικνύεται, ενισχύει, επιπροσθέτως
- ΜΟΝΟ οι αριθμημένες γραμμές στην απάντηση

Προτάσεις:
${numbered}`;

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1400, temperature: 0.8 }
        })
      }
    );
    if (!r.ok) {
      const err = await r.json();
      return res.status(r.status).json({ error: err.error?.message || 'Gemini error' });
    }
    const data = await r.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const lines = raw.split('\n').filter(l => l.trim());
    const result = [];
    for (let i = 1; i <= sentences.length; i++) {
      const re = new RegExp(`^\\[${i}\\]\\s*`);
      const line = lines.find(l => re.test(l));
      result.push(line ? line.replace(re, '').trim() : sentences[i - 1]);
    }
    return res.status(200).json({ sentences: result });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
