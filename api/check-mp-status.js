export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Order ID required' });
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
      }
    });

    const order = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: order.message || 'Error fetching order' });
    }

    const payment = order.transactions?.payments?.[0];

    return res.status(200).json({
      id: order.id,
      status: order.status,
      payment_status: payment?.status || null,
      payment_method: payment?.payment_method_id || null,
      qr_code: payment?.qr_code || null,
      qr_code_base64: payment?.qr_code_base64 || null,
      ticket_url: payment?.ticket_url || null
    });

  } catch (error) {
    console.error('Check status error:', error);
    return res.status(500).json({ error: error.message });
  }
}
