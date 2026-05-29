const fetch = globalThis.fetch || require('node-fetch');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, lang } = req.body || {};
  if (!text) return res.status(400).json({ error: 'Missing text' });

  const key = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
  if (!key) {
    if (process.env.MOCK_CLAUDE === '1') {
      return res.status(200).json({ ok: true, reply: 'Mock odpověď: Ahoj, tohle je testovací odpověď od Clauda (mock).' });
    }
    return res.status(501).json({ error: 'Server not configured. Set ANTHROPIC_API_KEY in env.' });
  }

  try {
    const payload = {
      model: 'claude-2.1',
      prompt: `\n\nHuman: ${text}\n\nAssistant:`,
      max_tokens_to_sample: 1000,
      stop_sequences: ['\n\nHuman:']
    };

    const r = await fetch('https://api.anthropic.com/v1/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify(payload)
    });

    const data = await r.json();
    const reply = data.completion || data.completion?.[0] || data.output || data.result || null;

    return res.status(200).json({ ok: true, reply: reply || data });
  } catch (err) {
    console.error('Forward error:', err);
    return res.status(500).json({ error: 'Failed to contact Anthropic', detail: String(err) });
  }
};
