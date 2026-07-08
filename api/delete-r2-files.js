import S3SDK from '@aws-sdk/client-s3';
const { S3Client, DeleteObjectCommand } = S3SDK;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || process.env.VITE_R2_ACCOUNT_ID;
  const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || process.env.VITE_R2_ACCESS_KEY_ID;
  const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || process.env.VITE_R2_SECRET_ACCESS_KEY;
  const R2_BUCKET = process.env.R2_BUCKET || process.env.VITE_R2_BUCKET || 'beatsbyrmx-audio';

  if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ACCOUNT_ID) {
    return res.status(500).json({ error: 'R2 credentials not configured' });
  }

  try {
    const { fileUrls } = req.body;
    if (!fileUrls || !Array.isArray(fileUrls) || fileUrls.length === 0) {
      return res.status(400).json({ error: 'fileUrls array required' });
    }

    const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || process.env.VITE_R2_PUBLIC_URL || 'https://pub-a0e5da93f63a416daff8f99cdaeaefc3.r2.dev';

    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });

    const results = await Promise.allSettled(
      fileUrls
        .filter(url => url && url.includes(R2_PUBLIC_URL))
        .map(url => {
          const key = url.replace(`${R2_PUBLIC_URL}/`, '');
          return s3.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
        })
    );

    return res.status(200).json({ deleted: results.length, results: results.map(r => r.status) });
  } catch (error) {
    console.error('R2 delete error:', error);
    return res.status(500).json({ error: error.message });
  }
}
