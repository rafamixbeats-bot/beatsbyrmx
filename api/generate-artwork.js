export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

    const geminiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ['IMAGE', 'TEXT'],
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      throw new Error(`Gemini API failed: ${geminiRes.status} - ${errText}`);
    }

    const data = await geminiRes.json();

    const candidates = data.candidates || [];
    if (candidates.length === 0) throw new Error('No candidates returned from Gemini');

    const parts = candidates[0].content?.parts || [];
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const mimeType = part.inlineData.mimeType || 'image/png';
        const ext = mimeType.includes('jpeg') || mimeType.includes('jpg') ? 'jpg' : 'png';
        const dataUrl = `data:${mimeType};base64,${part.inlineData.data}`;
        return res.status(200).json({ imageUrl: dataUrl });
      }
    }

    throw new Error('No image data found in Gemini response');
  } catch (error) {
    console.error('Gemini artwork error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
