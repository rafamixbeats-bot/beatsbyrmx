export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  if (!MP_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'MP_ACCESS_TOKEN not configured' });
  }

  try {
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const description = items.length === 1
      ? items[0].title
      : `${items.length} beats - RMX Beats`;

    const body = {
      transaction_amount: Number(total),
      description: description,
      payment_method_id: 'pix',
      payer: {
        email: 'buyer@beatsbyrmx.com'
      }
    };

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'X-Idempotency-Key': `rmx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MP Error:', JSON.stringify(data));
      return res.status(response.status).json({
        error: data.message || 'Error creating Pix payment',
        details: data
      });
    }

    const pixData = data.point_of_interaction?.transaction_data;

    return res.status(200).json({
      id: data.id,
      status: data.status,
      qr_code: pixData?.qr_code || null,
      qr_code_base64: pixData?.qr_code_base64 || null,
      ticket_url: pixData?.ticket_url || null,
      expiration: data.date_of_expiration || null
    });

  } catch (error) {
    console.error('Pix creation error:', error);
    return res.status(500).json({ error: error.message });
  }
}
