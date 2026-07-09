import S3SDK from '@aws-sdk/client-s3';
const { S3Client, HeadObjectCommand, GetObjectCommand, PutObjectCommand } = S3SDK;

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
  const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || process.env.VITE_R2_PUBLIC_URL || 'https://pub-a0e5da93f63a416daff8f99cdaeaefc3.r2.dev';

  if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ACCOUNT_ID) {
    return res.status(500).json({ error: 'R2 credentials not configured' });
  }

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });

  const mimeMap = { '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.aif': 'audio/aif', '.aiff': 'audio/aiff' };

  try {
    const { samples } = req.body;
    if (!samples || !Array.isArray(samples) || samples.length === 0) {
      return res.status(400).json({ error: 'samples array required' });
    }

    const results = [];

    for (const sample of samples) {
      const { fileUrl, fileName } = sample;
      if (!fileUrl || !fileName) continue;

      const ext = fileName.split('.').pop()?.toLowerCase() || 'wav';
      const expectedContentType = mimeMap[`.${ext}`] || 'audio/wav';
      const key = fileUrl.replace(`${R2_PUBLIC_URL}/`, '');

      try {
        const headCmd = new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key });
        const headResponse = await s3.send(headCmd);
        const currentContentType = headResponse.ContentType || '';

        if (currentContentType === expectedContentType) {
          results.push({ fileName, status: 'skipped', reason: 'already correct', currentContentType });
          continue;
        }
      } catch (headError) {
        results.push({ fileName, status: 'error', reason: `HEAD failed: ${headError.message}` });
        continue;
      }

      try {
        const getCmd = new GetObjectCommand({ Bucket: R2_BUCKET, Key: key });
        const getResponse = await s3.send(getCmd);
        const fileBuffer = Buffer.from(await getResponse.Body.transformToByteArray());

        const cleanFileName = fileName.replace(/\s+/g, '-').toLowerCase();
        const newKey = `${Date.now()}-${cleanFileName}`;

        const putCmd = new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: newKey,
          Body: fileBuffer,
          ContentType: expectedContentType,
        });
        await s3.send(putCmd);

        const newPublicUrl = `${R2_PUBLIC_URL}/${newKey}`;
        results.push({ fileName, status: 'fixed', oldContentType: 'wrong', newContentType: expectedContentType, newUrl: newPublicUrl });
      } catch (error) {
        results.push({ fileName, status: 'error', reason: error.message });
      }
    }

    return res.status(200).json({ results });
  } catch (error) {
    console.error('R2 fix MIME error:', error);
    return res.status(500).json({ error: error.message });
  }
}
