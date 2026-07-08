export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Payment ID required' });
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
      }
    });

    const payment = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: payment.message || 'Error fetching payment' });
    }

    return res.status(200).json({
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail || null,
      payment_method: payment.payment_method_id || null,
      qr_code: payment.point_of_interaction?.transaction_data?.qr_code || null,
      qr_code_base64: payment.point_of_interaction?.transaction_data?.qr_code_base64 || null,
      ticket_url: payment.point_of_interaction?.transaction_data?.ticket_url || null
    });

  } catch (error) {
    console.error('Check status error:', error);
    return res.status(500).json({ error: error.message });
  }
}
