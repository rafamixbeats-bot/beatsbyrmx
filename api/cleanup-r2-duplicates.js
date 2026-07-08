import S3SDK from '@aws-sdk/client-s3';
const { S3Client, ListObjectsV2Command, DeleteObjectCommand } = S3SDK;

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

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  });

  try {
    const { dryRun } = req.body || {};

    // List all objects
    let allObjects = [];
    let continuationToken = undefined;
    do {
      const command = new ListObjectsV2Command({ Bucket: R2_BUCKET, ContinuationToken: continuationToken });
      const response = await s3.send(command);
      if (response.Contents) allObjects.push(...response.Contents);
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    // Group by base name (strip timestamp prefix: "1234567890-filename.ext")
    const groups = {};
    for (const obj of allObjects) {
      const key = obj.Key;
      // Pattern: timestamp(s)-basename
      const match = key.match(/^\d+-(.+)$/);
      const baseName = match ? match[1] : key;
      if (!groups[baseName]) groups[baseName] = [];
      groups[baseName].push({ key, lastModified: obj.LastModified, size: obj.Size });
    }

    // Find duplicates (keep newest, delete rest)
    const toDelete = [];
    for (const [baseName, files] of Object.entries(groups)) {
      if (files.length > 1) {
        files.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        const newest = files[0];
        const olders = files.slice(1);
        for (const f of olders) {
          toDelete.push({ key: f.key, size: f.size, lastModified: f.lastModified, baseName });
        }
      }
    }

    if (toDelete.length === 0) {
      return res.status(200).json({ message: 'No duplicates found', total: allObjects.length, duplicates: 0 });
    }

    const totalSizeMB = (toDelete.reduce((sum, f) => sum + (f.size || 0), 0) / 1024 / 1024).toFixed(2);

    if (dryRun) {
      return res.status(200).json({
        dryRun: true,
        totalObjects: allObjects.length,
        duplicatesFound: toDelete.length,
        spaceToFree: `${totalSizeMB} MB`,
        files: toDelete.map(f => ({ key: f.key, size: `${(f.size / 1024 / 1024).toFixed(2)} MB`, lastModified: f.lastModified }))
      });
    }

    // Delete duplicates
    const results = await Promise.allSettled(
      toDelete.map(f => s3.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: f.key })))
    );

    return res.status(200).json({
      totalObjects: allObjects.length,
      deleted: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length,
      spaceFreed: `${totalSizeMB} MB`
    });

  } catch (error) {
    console.error('R2 cleanup error:', error);
    return res.status(500).json({ error: error.message });
  }
}
