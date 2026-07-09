import S3SDK from '@aws-sdk/client-s3';
import s3Presigner from '@aws-sdk/s3-request-presigner';
const { S3Client, GetObjectCommand, PutObjectCommand } = S3SDK;
const { getSignedUrl } = s3Presigner;

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

  try {
    const { fileUrl, fileName, contentType } = req.body;
    if (!fileUrl || !fileName) {
      return res.status(400).json({ error: 'fileUrl and fileName required' });
    }

    const mimeMap = { '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.aif': 'audio/aif', '.aiff': 'audio/aiff' };
    const ext = fileName.split('.').pop()?.toLowerCase() || 'wav';
    const resolvedContentType = contentType || mimeMap[`.${ext}`] || 'audio/wav';

    const oldKey = fileUrl.replace(`${R2_PUBLIC_URL}/`, '');

    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });

    const getCmd = new GetObjectCommand({ Bucket: R2_BUCKET, Key: oldKey });
    const getResponse = await s3.send(getCmd);
    const fileBuffer = Buffer.from(await getResponse.Body.transformToByteArray());

    const cleanFileName = fileName.replace(/\s+/g, '-').toLowerCase();
    const newKey = `${Date.now()}-${cleanFileName}`;

    const putCmd = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: newKey,
      Body: fileBuffer,
      ContentType: resolvedContentType,
    });
    await s3.send(putCmd);

    const newPublicUrl = `${R2_PUBLIC_URL}/${newKey}`;

    return res.status(200).json({ newUrl: newPublicUrl, newKey, contentType: resolvedContentType });
  } catch (error) {
    console.error('R2 fix MIME error:', error);
    return res.status(500).json({ error: error.message });
  }
}
