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

    const now = new Date();
    const expiration = new Date(now.getTime() + 30 * 60 * 1000);

    const orderItems = items.map(item => ({
      title: item.title,
      description: item.description || item.title,
      quantity: 1,
      unit_price: Number(item.price),
      currency_id: 'BRL'
    }));

    const body = {
      type: 'online',
      external_reference: `RMX-${Date.now()}`,
      transactions: {
        payments: [{
          payment_method_id: 'pix',
          amount: Number(total),
          date_of_expiration: expiration.toISOString(),
          descriptor: 'RMXBEATS'
        }]
      },
      items: orderItems
    };

    const response = await fetch('https://api.mercadopago.com/v1/orders', {
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
      return res.status(response.status).json({ error: data.message || 'Error creating Pix payment', details: data });
    }

    const payment = data.transactions?.payments?.[0];

    return res.status(200).json({
      id: data.id,
      qr_code: payment?.qr_code || null,
      qr_code_base64: payment?.qr_code_base64 || null,
      ticket_url: payment?.ticket_url || null,
      external_reference: data.external_reference,
      expiration: expiration.toISOString()
    });

  } catch (error) {
    console.error('Pix creation error:', error);
    return res.status(500).json({ error: error.message });
  }
}
