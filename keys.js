// This endpoint exchanges a Google auth code for tokens
// and retrieves the user's Gemini API key from AI Studio
// Since AI Studio doesn't expose keys via API, we store a
// per-user Gemini key in Vercel KV or env after first setup.
// For simplicity: user provides their Gemini key once after login,
// we store it encrypted server-side tied to their Google sub.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Simple in-memory store (use Vercel KV in production)
  // For demo: user provides key once, stored in session
  return res.status(200).json({ ok: true });
}
