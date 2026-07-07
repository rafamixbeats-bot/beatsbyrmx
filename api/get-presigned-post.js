import { S3Client, CreatePresignedPostCommand } from '@aws-sdk/client-s3';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { fileName } = req.query;
  if (!fileName) return res.status(400).json({ error: 'fileName required' });

  const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || process.env.VITE_R2_ACCOUNT_ID;
  const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || process.env.VITE_R2_ACCESS_KEY_ID;
  const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || process.env.VITE_R2_SECRET_ACCESS_KEY;
  const R2_BUCKET = process.env.R2_BUCKET || process.env.VITE_R2_BUCKET || 'beatsbyrmx-audio';
  const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || process.env.VITE_R2_PUBLIC_URL || 'https://pub-a0e5da93f63a416daff8f99cdaeaefc3.r2.dev';

  if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ACCOUNT_ID) {
    return res.status(500).json({ error: 'R2 credentials not configured' });
  }

  try {
    const cleanFileName = fileName.replace(/\s+/g, '-').toLowerCase();
    const uniqueFileName = `${Date.now()}-${cleanFileName}`;

    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });

    const command = new CreatePresignedPostCommand({
      Bucket: R2_BUCKET,
      Key: uniqueFileName,
      Expires: 3600,
      Conditions: [
        ['content-length-range', 0, 10 * 1024 * 1024 * 1024],
      ],
    });

    const presigned = await s3.send(command);

    return res.status(200).json({
      uploadUrl: presigned.url,
      fields: presigned.fields,
      cdnUrl: `${R2_PUBLIC_URL}/${uniqueFileName}`,
    });
  } catch (error) {
    console.error('R2 Error:', error);
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
