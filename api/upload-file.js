export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const B2_KEY_ID = process.env.VITE_B2_KEY_ID;
  const B2_APP_KEY = process.env.VITE_B2_APP_KEY;
  const B2_BUCKET = process.env.VITE_B2_BUCKET || 'beatsbyrmx-audio';
  const CDN_URL = process.env.VITE_B2_BUCKET_URL || 'https://cdn.beatsbyrmx.com/beatsbyrmx-audio';

  if (!B2_KEY_ID || !B2_APP_KEY) {
    return res.status(500).json({ error: 'B2 credentials not configured' });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const fileName = formData.get('fileName');

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const cleanFileName = (fileName || file.name).replace(/\s+/g, '-').toLowerCase();
    const uniqueFileName = `${Date.now()}-${cleanFileName}`;

    const authRes = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${B2_KEY_ID}:${B2_APP_KEY}`).toString('base64')}`,
      },
    });

    if (!authRes.ok) {
      const errText = await authRes.text();
      return res.status(500).json({ error: `B2 auth failed: ${authRes.status} - ${errText}` });
    }

    const authData = await authRes.json();

    let bucketId = authData.allowed?.bucketId;
    if (!bucketId) {
      const bucketsRes = await fetch(`${authData.apiUrl}/b2api/v2/b2_list_buckets`, {
        method: 'POST',
        headers: {
          'Authorization': authData.authorizationToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      if (!bucketsRes.ok) throw new Error('Could not list buckets');
      const bucketsData = await bucketsRes.json();
      const bucket = bucketsData.buckets.find((b) => b.bucketName === B2_BUCKET);
      if (!bucket) throw new Error(`Bucket "${B2_BUCKET}" not found`);
      bucketId = bucket.bucketId;
    }

    const uploadUrlRes = await fetch(`${authData.apiUrl}/b2api/v2/b2_get_upload_url`, {
      method: 'POST',
      headers: {
        'Authorization': authData.authorizationToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bucketId }),
    });

    if (!uploadUrlRes.ok) {
      const errText = await uploadUrlRes.text();
      return res.status(500).json({ error: `Get upload URL failed: ${uploadUrlRes.status} - ${errText}` });
    }

    const uploadUrlData = await uploadUrlRes.json();

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { createHash } = await import('crypto');
    const sha1 = createHash('sha1').update(fileBuffer).digest('hex');

    const uploadRes = await fetch(uploadUrlData.uploadUrl, {
      method: 'POST',
      body: fileBuffer,
      headers: {
        'Authorization': uploadUrlData.authorizationToken,
        'X-Bz-File-Name': encodeURIComponent(uniqueFileName),
        'Content-Type': file.type || 'application/octet-stream',
        'X-Bz-Sha1': sha1,
      },
    });

    if (!uploadRes.ok) {
      const errBody = await uploadRes.text();
      return res.status(500).json({ error: `Upload failed: ${uploadRes.status} - ${errBody}` });
    }

    const cdnUrl = `${CDN_URL}/${uniqueFileName}`;
    return res.status(200).json({ url: cdnUrl, fileName: uniqueFileName });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
