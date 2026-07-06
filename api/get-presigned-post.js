import { createHmac } from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { fileName } = req.query;
  if (!fileName) return res.status(400).json({ error: 'fileName required' });

  const B2_KEY_ID = process.env.VITE_B2_KEY_ID;
  const B2_APP_KEY = process.env.VITE_B2_APP_KEY;
  const B2_BUCKET = process.env.VITE_B2_BUCKET || 'beatsbyrmx-audio';
  const B2_ENDPOINT = 's3.us-east-005.backblazeb2.com';
  const REGION = 'us-east-005';

  if (!B2_KEY_ID || !B2_APP_KEY) {
    return res.status(500).json({ error: 'B2 credentials not configured' });
  }

  try {
    const cleanFileName = fileName.replace(/\s+/g, '-').toLowerCase();
    const uniqueFileName = `${Date.now()}-${cleanFileName}`;

    const expiration = new Date(Date.now() + 3600 * 1000).toISOString();

    const policy = {
      expiration,
      conditions: [
        { bucket: B2_BUCKET },
        ['starts-with', '$key', ''],
        ['content-length-range', 0, 10 * 1024 * 1024 * 1024],
      ],
    };

    const policyBase64 = Buffer.from(JSON.stringify(policy)).toString('base64');
    const signature = createHmac('sha1', B2_APP_KEY).update(policyBase64).digest('base64');

    return res.status(200).json({
      uploadUrl: `https://${B2_ENDPOINT}/${B2_BUCKET}`,
      fields: {
        key: uniqueFileName,
        AWSAccessKeyId: B2_KEY_ID,
        policy: policyBase64,
        signature,
      },
      cdnUrl: `https://cdn.beatsbyrmx.com/beatsbyrmx-audio/${uniqueFileName}`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
