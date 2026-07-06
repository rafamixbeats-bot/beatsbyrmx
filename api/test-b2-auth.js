export default async function handler(req, res) {
  const keyId = process.env.VITE_B2_KEY_ID || '';
  const appKey = process.env.VITE_B2_APP_KEY || '';
  const bucket = process.env.VITE_B2_BUCKET || '';

  const maskedKeyId = keyId ? keyId.substring(0, 6) + '...' + keyId.substring(keyId.length - 4) : 'EMPTY';
  const maskedAppKey = appKey ? appKey.substring(0, 6) + '...' + appKey.substring(appKey.length - 4) : 'EMPTY';

  if (!keyId || !appKey) {
    return res.status(200).json({
      status: 'MISSING_CREDENTIALS',
      keyId: maskedKeyId,
      appKey: maskedAppKey,
      bucket: bucket || 'EMPTY',
    });
  }

  try {
    const authString = `${keyId}:${appKey}`;
    const encoded = Buffer.from(authString).toString('base64');

    const authRes = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
      headers: {
        'Authorization': `Basic ${encoded}`,
      },
    });

    const status = authRes.status;
    if (!authRes.ok) {
      const errText = await authRes.text();
      return res.status(200).json({
        status: 'AUTH_FAILED',
        httpStatus: status,
        error: errText,
        keyId: maskedKeyId,
        appKey: maskedAppKey,
      });
    }

    const authData = await authRes.json();
    return res.status(200).json({
      status: 'AUTH_OK',
      keyId: maskedKeyId,
      appKey: maskedAppKey,
      bucket: bucket,
      accountId: authData.accountId,
      allowedCapabilities: authData.allowed?.capabilities,
    });
  } catch (error) {
    return res.status(200).json({
      status: 'ERROR',
      error: error.message,
      keyId: maskedKeyId,
      appKey: maskedAppKey,
    });
  }
}
