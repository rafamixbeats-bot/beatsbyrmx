export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  const KIE_API_KEY = process.env.KIE_API_KEY;
  if (!KIE_API_KEY) return res.status(500).json({ error: 'KIE_API_KEY not configured' });

  try {
    // Step 1: Create generation task
    const createRes = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/nano-banana',
        input: { prompt },
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      throw new Error(`Kie.ai create task failed: ${createRes.status} - ${errText}`);
    }

    const createData = await createRes.json();
    const taskId = createData.data?.taskId || createData.taskId || createData.id;

    if (!taskId) throw new Error('No taskId returned from Kie.ai');

    // Step 2: Poll for result (max 60 seconds)
    let result = null;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 2000));

      const pollRes = await fetch(`https://api.kie.ai/api/v1/jobs/queryTask?taskId=${taskId}`, {
        headers: { 'Authorization': `Bearer ${KIE_API_KEY}` },
      });

      if (!pollRes.ok) continue;

      const pollData = await pollRes.json();
      const status = pollData.data?.status || pollData.status;

      if (status === 'COMPLETED' || status === 'completed' || status === 'SUCCESS') {
        result = pollData.data?.result?.imageUrl || pollData.data?.result?.url || pollData.data?.imageUrl || pollData.data?.output?.imageUrl;
        break;
      }

      if (status === 'FAILED' || status === 'failed' || status === 'ERROR') {
        throw new Error('Image generation failed: ' + (pollData.data?.error || 'Unknown error'));
      }
    }

    if (!result) throw new Error('Timeout waiting for image generation');

    return res.status(200).json({ imageUrl: result });
  } catch (error) {
    console.error('Nano Banana error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
